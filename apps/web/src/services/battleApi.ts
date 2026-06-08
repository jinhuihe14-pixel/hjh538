import request from './request';
import type { BattleReport } from '@game/shared';

export const battleApi = {
  startPvE: (stageId: number) => {
    return request.post<any, BattleReport>('/battle/pve', { stageId });
  },

  startPvP: (defenderId: string) => {
    return request.post<any, BattleReport>('/battle/pvp', { defenderId });
  },

  getReport: (id: string) => {
    return request.get<any, BattleReport>(`/battle/report/${id}`);
  },

  getList: (page = 1, pageSize = 20) => {
    return request.get<any, { list: BattleReport[]; total: number }>('/battle/list', {
      params: { page, pageSize },
    });
  },
};
