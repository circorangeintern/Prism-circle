import { prisma } from '../../../configs/database.config.js';
import { AppError } from '../../../errors/index.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class UpdateLocationCommand {
  async execute(params: {
    type: 'state' | 'lga' | 'city' | 'town' | 'neighborhood';
    id: number;
    name: string;
  }) {
    const modelMap = {
      state: prisma.state,
      lga: prisma.lGA,
      city: prisma.city,
      town: prisma.town,
      neighborhood: prisma.neighborhood,
    } as const;

    const model = modelMap[params.type];
    if (!model) {
      throw new AppError(400, 'Invalid location type.');
    }

    const existing = await (model as any).findUnique({ where: { id: params.id } });
    if (!existing) {
      throw new AppError(404, MESSAGES.NOT_FOUND);
    }

    return (model as any).update({
      where: { id: params.id },
      data: { name: params.name },
    });
  }
}
