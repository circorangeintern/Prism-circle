import { Prisma } from '@prisma/client';
import { prisma } from '../../../configs/database.config.js';
import { env } from '../../../configs/env.config.js';
import type { ReverseGeocodeResult } from '../../../interfaces/index.js';

interface NominatimAddress {
  state?: string;
  county?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  hamlet?: string;
  road?: string;
  state_district?: string;
  country?: string;
  country_code?: string;
}

const STATE_SUFFIXES = [' State', ' state', 'Staat'];

export class ReverseGeocodeQuery {
  async execute(latitude: number, longitude: number): Promise<ReverseGeocodeResult> {
    try {
      return await this.reverseWithNominatim(latitude, longitude);
    } catch {
      return this.reverseWithLgaPackage(latitude, longitude);
    }
  }

  private async nextId(table: 'state' | 'lGA' | 'city' | 'town' | 'neighborhood'): Promise<number> {
    const result = await (prisma[table] as any).aggregate({ _max: { id: true } });
    return (result._max.id ?? 0) + 1;
  }

  private async findOrCreateState(name: string, countryId: number) {
    let state = await prisma.state.findFirst({ where: { name } });
    if (state) return state;

    for (const suffix of STATE_SUFFIXES) {
      if (name.endsWith(suffix)) {
        const stripped = name.slice(0, -suffix.length);
        state = await prisma.state.findFirst({ where: { name: stripped } });
        if (state) return state;
      }
    }

    const id = await this.nextId('state');
    try {
      return await prisma.state.create({ data: { id, name, countryId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await prisma.state.findFirst({ where: { name } });
        if (existing) return existing;
      }
      throw error;
    }
  }

  private async findOrCreateLGA(name: string, stateId: number) {
    const existing = await prisma.lGA.findFirst({ where: { name, stateId } });
    if (existing) return existing;

    const id = await this.nextId('lGA');
    try {
      return await prisma.lGA.create({ data: { id, name, stateId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const found = await prisma.lGA.findFirst({ where: { name, stateId } });
        if (found) return found;
      }
      throw error;
    }
  }

  private async findOrCreateCity(name: string, lgaId: number) {
    const existing = await prisma.city.findFirst({ where: { name, lgaId } });
    if (existing) return existing;

    const id = await this.nextId('city');
    try {
      return await prisma.city.create({ data: { id, name, lgaId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const found = await prisma.city.findFirst({ where: { name, lgaId } });
        if (found) return found;
      }
      throw error;
    }
  }

  private async findOrCreateTown(name: string, cityId: number) {
    const existing = await prisma.town.findFirst({ where: { name, cityId } });
    if (existing) return existing;

    const id = await this.nextId('town');
    try {
      return await prisma.town.create({ data: { id, name, cityId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const found = await prisma.town.findFirst({ where: { name, cityId } });
        if (found) return found;
      }
      throw error;
    }
  }

  private async findOrCreateNeighborhood(name: string, townId: number) {
    const existing = await prisma.neighborhood.findFirst({ where: { name, townId } });
    if (existing) return existing;

    const id = await this.nextId('neighborhood');
    try {
      return await prisma.neighborhood.create({ data: { id, name, townId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const found = await prisma.neighborhood.findFirst({ where: { name, townId } });
        if (found) return found;
      }
      throw error;
    }
  }

  private async reverseWithNominatim(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': `PowerWatch/1.0 (${env.admin.email || 'oluwayemioyinlola2@gmail.com'})`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Nominatim returned ${res.status}`);
    }

    const data = (await res.json()) as { address?: NominatimAddress };
    const address = data?.address;

    if (!address?.state) {
      throw new Error('Nominatim did not return state');
    }

    const country = await prisma.country.findFirst({ where: { name: 'Nigeria' } });
    const countryId = country?.id ?? 1;

    const state = await this.findOrCreateState(address.state, countryId);

    const lgaCandidates = [
      address.county,
      address.state_district,
      address.city,
      address.town,
      address.village,
    ].filter(Boolean) as string[];

    let lgaName = lgaCandidates[0] ?? address.state;
    let lga = await prisma.lGA.findFirst({ where: { name: lgaName, stateId: state.id } });
    if (!lga) {
      for (const candidate of lgaCandidates) {
        lga = await prisma.lGA.findFirst({ where: { name: candidate, stateId: state.id } });
        if (lga) { lgaName = candidate; break; }
      }
    }
    if (!lga) {
      lga = await this.findOrCreateLGA(lgaName, state.id);
    }

    const cityName = address.city || address.town || address.village || address.suburb || lgaName;
    const townName = address.town || address.village || address.suburb || address.neighbourhood || cityName;
    const neighborhoodName = address.suburb || address.neighbourhood || address.hamlet || townName;

    return this.resolveHierarchy(
      countryId, state.name, state.id, lgaName, lga.id, cityName, townName, neighborhoodName, 0,
      { suburb: address.suburb ?? null, village: address.village ?? null, road: address.road ?? null },
    );
  }

  private async reverseWithLgaPackage(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult> {
    const { getByCoordinates } = await import('nigeria-lga-data');
    const result = getByCoordinates(latitude, longitude);

    if (!result || !result.lga) {
      throw new Error('No location found for the given coordinates.');
    }

    const lgaName = result.lga.name;
    const stateName = result.lga.state;
    const distanceKm = result.distanceKm;

    const country = await prisma.country.findFirst({ where: { name: 'Nigeria' } });
    const countryId = country?.id ?? 1;
    const state = await this.findOrCreateState(stateName, countryId);
    const lga = await this.findOrCreateLGA(lgaName, state.id);

    return this.resolveHierarchy(
      countryId, state.name, state.id, lga.name, lga.id, lgaName, lgaName, lgaName, distanceKm,
      { suburb: null, village: null, road: null },
    );
  }

  private async resolveHierarchy(
    countryId: number,
    stateName: string,
    stateId: number,
    lgaName: string,
    lgaId: number,
    cityName: string,
    townName: string,
    neighborhoodName: string,
    distanceKm: number = 0,
    osmAddress: { suburb: string | null; village: string | null; road: string | null } = { suburb: null, village: null, road: null },
  ): Promise<ReverseGeocodeResult> {
    const country = await prisma.country.findUnique({ where: { id: countryId } });
    const city = await this.findOrCreateCity(cityName, lgaId);
    const town = await this.findOrCreateTown(townName, city.id);
    const neighborhood = await this.findOrCreateNeighborhood(neighborhoodName, town.id);

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
      distanceKm,
      suburb: osmAddress.suburb,
      village: osmAddress.village,
      road: osmAddress.road,
    };
  }
}
