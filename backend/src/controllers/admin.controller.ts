import type { FastifyRequest, FastifyReply } from 'fastify';
import { GetDashboardQuery } from '../services/admin/queries/getDashboard.query.js';
import { GetAnalyticsQuery } from '../services/admin/queries/getAnalytics.query.js';
import { GetUsersQuery } from '../services/admin/queries/getUsers.query.js';
import { GetLocationsQuery } from '../services/admin/queries/getLocations.query.js';
import { UpdateLocationCommand } from '../services/admin/commands/updateLocation.command.js';
import { SuspendUserCommand } from '../services/admin/commands/suspendUser.command.js';
import { DeleteUserCommand } from '../services/admin/commands/deleteUser.command.js';
import { DeleteReportCommand } from '../services/admin/commands/deleteReport.command.js';
import { SendBroadcastCommand } from '../services/admin/commands/sendBroadcast.command.js';
import { MaterializeDailySummaryCommand } from '../services/analytics/commands/materializeDailySummary.command.js';
import { MaterializeWeeklySummaryCommand } from '../services/analytics/commands/materializeWeeklySummary.command.js';
import { MaterializeMonthlySummaryCommand } from '../services/analytics/commands/materializeMonthlySummary.command.js';
import { successResponse } from '../utils/response.js';

const getDashboardQuery = new GetDashboardQuery();
const getAnalyticsQuery = new GetAnalyticsQuery();
const getUsersQuery = new GetUsersQuery();
const getLocationsQuery = new GetLocationsQuery();
const updateLocationCommand = new UpdateLocationCommand();
const suspendUserCommand = new SuspendUserCommand();
const deleteUserCommand = new DeleteUserCommand();
const deleteReportCommand = new DeleteReportCommand();
const sendBroadcastCommand = new SendBroadcastCommand();
const materializeDailyCommand = new MaterializeDailySummaryCommand();
const materializeWeeklyCommand = new MaterializeWeeklySummaryCommand();
const materializeMonthlyCommand = new MaterializeMonthlySummaryCommand();

export const adminController = {
  async getDashboard(_request: FastifyRequest, reply: FastifyReply) {
    const result = await getDashboardQuery.execute();
    return reply.status(200).send(successResponse(result, 'Dashboard fetched.'));
  },

  async getAnalytics(request: FastifyRequest, reply: FastifyReply) {
    const { startDate, endDate } = request.query as { startDate?: string; endDate?: string };
    const params: { startDate?: string; endDate?: string } = {};
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;
    const result = await getAnalyticsQuery.execute(params);
    return reply.status(200).send(successResponse(result, 'Analytics fetched.'));
  },

  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit, search, role } = request.query as {
      page?: string; limit?: string; search?: string; role?: string;
    };
    const params: { page: number; limit: number; search?: string; role?: string } = {
      page: Math.max(1, Number(page) || 1),
      limit: Math.min(100, Math.max(1, Number(limit) || 20)),
    };
    if (search !== undefined) params.search = search;
    if (role !== undefined) params.role = role;
    const result = await getUsersQuery.execute(params);
    return reply.status(200).send(successResponse(result, 'Users fetched.'));
  },

  async getLocations(_request: FastifyRequest, reply: FastifyReply) {
    const result = await getLocationsQuery.execute();
    return reply.status(200).send(successResponse(result, 'Locations fetched.'));
  },

  async updateLocation(request: FastifyRequest, reply: FastifyReply) {
    const { type, id, name } = request.body as { type: 'state' | 'lga' | 'city' | 'town' | 'neighborhood'; id: number; name: string };
    const result = await updateLocationCommand.execute({ type, id, name });
    return reply.status(200).send(successResponse(result, 'Location updated.'));
  },

  async suspendUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    await suspendUserCommand.execute(userId);
    return reply.status(200).send(successResponse({}, 'User suspended.'));
  },

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    await deleteUserCommand.execute(userId);
    return reply.status(200).send(successResponse({}, 'User deleted.'));
  },

  async deleteReport(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await deleteReportCommand.execute(id);
    return reply.status(200).send(successResponse({}, 'Report deleted.'));
  },

  async sendBroadcast(request: FastifyRequest, reply: FastifyReply) {
    const { title, body, topic } = request.body as { title: string; body: string; topic?: string };
    const params: { title: string; body: string; topic?: string } = { title, body };
    if (topic !== undefined) params.topic = topic;
    const result = await sendBroadcastCommand.execute(params);
    return reply.status(200).send(successResponse(result, 'Broadcast sent.'));
  },

  async materializeDaily(request: FastifyRequest, reply: FastifyReply) {
    const { date } = request.query as { date?: string };
    const result = await materializeDailyCommand.execute(date ? new Date(date) : undefined);
    return reply.status(200).send(successResponse(result, 'Daily summaries materialized.'));
  },

  async materializeWeekly(request: FastifyRequest, reply: FastifyReply) {
    const { weekStart } = request.query as { weekStart?: string };
    const result = await materializeWeeklyCommand.execute(weekStart ? new Date(weekStart) : undefined);
    return reply.status(200).send(successResponse(result, 'Weekly summaries materialized.'));
  },

  async materializeMonthly(request: FastifyRequest, reply: FastifyReply) {
    const { monthStart } = request.query as { monthStart?: string };
    const result = await materializeMonthlyCommand.execute(monthStart ? new Date(monthStart) : undefined);
    return reply.status(200).send(successResponse(result, 'Monthly summaries materialized.'));
  },
};
