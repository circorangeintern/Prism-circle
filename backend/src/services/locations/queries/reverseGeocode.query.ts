import { createRequire } from 'node:module';
import { prisma } from '../../../configs/database.config.js';
import { AppError } from '../../../errors/index.js';
import type { ReverseGeocodeResult } from '../../../interfaces/index.js';

const require = createRequire(import.meta.url);

interface NominatimAddress {
  state?: string;
  county?: string;
  country?: string;
  country_code?: string;
}

export class ReverseGeocodeQuery {
  async execute(latitude: number, longitude: number): Promise<ReverseGeocodeResult> {
    try {
      return await this.reverseWithNominatim(latitude, longitude);
    } catch {
      return this.reverseWithLgaPackage(latitude, longitude);
    }
  }

  private async reverseWithNominatim(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PowerWatch/1.0' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Nominatim returned ${res.status}`);
    }

    const data = (await res.json()) as { address?: NominatimAddress };
    const address = data?.address;

    if (!address?.state || !address?.county) {
      throw new Error('Nominatim did not return state/county');
    }

    const stateName = address.state;
    const lgaName = address.county;

    const state = await prisma.state.findFirst({
      where: { name: stateName },
    });
    if (!state) {
      throw new AppError(404, `State "${stateName}" not found in database.`);
    }

    const lga = await prisma.lGA.findFirst({
      where: { name: lgaName, stateId: state.id },
    });
    if (!lga) {
      throw new AppError(404, `LGA "${lgaName}" not found in database.`);
    }

    return this.resolveHierarchy(state.countryId, state.name, state.id, lga.name, lga.id);
  }

  private async reverseWithLgaPackage(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult> {
    const lgaData = require('nigeria-lga-data');
    const result = lgaData.getByCoordinates(latitude, longitude);

    if (!result || !result.lga) {
      throw new AppError(404, 'No location found for the given coordinates.');
    }

    const lgaName = result.lga.name;
    const stateName = result.lga.state;
    const distanceKm = result.distanceKm;

    const state = await prisma.state.findFirst({
      where: { name: stateName },
    });
    if (!state) {
      throw new AppError(404, `State "${stateName}" not found in database.`);
    }

    const lga = await prisma.lGA.findFirst({
      where: { name: lgaName, stateId: state.id },
    });
    if (!lga) {
      throw new AppError(404, `LGA "${lgaName}" not found in database.`);
    }

    return this.resolveHierarchy(state.countryId, state.name, state.id, lga.name, lga.id);
  }

  private async resolveHierarchy(
    countryId: number,
    stateName: string,
    stateId: number,
    lgaName: string,
    lgaId: number,
  ): Promise<ReverseGeocodeResult> {
    const country = await prisma.country.findUnique({ where: { id: countryId } });

    const city = await prisma.city.findFirst({
      where: { lgaId },
      orderBy: { id: 'asc' },
    });
    if (!city) {
      throw new AppError(404, `No city found for LGA ID ${lgaId}.`);
    }

    const town = await prisma.town.findFirst({
      where: { cityId: city.id },
      orderBy: { id: 'asc' },
    });
    if (!town) {
      throw new AppError(404, `No town found for city "${city.name}".`);
    }

    const neighborhood = await prisma.neighborhood.findFirst({
      where: { townId: town.id },
      orderBy: { id: 'asc' },
    });
    if (!neighborhood) {
      throw new AppError(404, `No neighborhood found for town "${town.name}".`);
    }

    return {
      countryId,
      country: country?.name ?? 'Nigeria',
      stateId,
      state: stateName,
      lgaId,
      lga: lgaName,
      cityId: city.id,
      city: city.name,
      townId: town.id,
      town: town.name,
      neighborhoodId: neighborhood.id,
      neighborhood: neighborhood.name,
      distanceKm: 0,
    };
  }
}
