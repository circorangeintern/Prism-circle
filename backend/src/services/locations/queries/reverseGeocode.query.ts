import { createRequire } from 'node:module';
import { prisma } from '../../../configs/database.config.js';
import { AppError } from '../../../errors/index.js';

const require = createRequire(import.meta.url);
const lgaData = require('nigeria-lga-data');

interface ReverseGeocodeResult {
  countryId: number;
  stateId: number;
  lgaId: number;
  cityId: number;
  townId: number;
  neighborhoodId: number;
  distanceKm: number;
}

export class ReverseGeocodeQuery {
  async execute(latitude: number, longitude: number): Promise<ReverseGeocodeResult> {
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

    const city = await prisma.city.findFirst({
      where: { lgaId: lga.id },
      orderBy: { id: 'asc' },
    });

    if (!city) {
      throw new AppError(404, `No city found for LGA "${lgaName}".`);
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
      countryId: state.countryId,
      stateId: state.id,
      lgaId: lga.id,
      cityId: city.id,
      townId: town.id,
      neighborhoodId: neighborhood.id,
      distanceKm,
    };
  }
}
