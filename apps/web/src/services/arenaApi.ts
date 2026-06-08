import request from './request';

export interface RankInfo {
  id: string;
  userId: string;
  seasonId: number;
  rank: number;
  score: number;
  tier: number;
  division: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestRank: number;
  bestTier: number;
}

export interface RankItem {
  rank: number;
  userId: string;
  nickname: string;
  avatar: string | null;
  level: number;
  score: number;
  tier: number;
  division: number;
}

export interface SeasonInfo {
  id: number;
  name: string;
  type: number;
  status: number;
  startAt: string;
  endAt: string;
}

export const arenaApi = {
  getCurrentSeason: () => {
    return request.get<any, SeasonInfo>('/arena/season');
  },

  getRankInfo: (seasonId: number) => {
    return request.get<any, RankInfo>('/arena/rank/info', {
      params: { seasonId },
    });
  },

  getRankList: (seasonId: number, page = 1, pageSize = 20) => {
    return request.get<any, { list: RankItem[]; total: number; page: number; pageSize: number }>(
      '/arena/rank/list',
      { params: { seasonId, page, pageSize } },
    );
  },

  startBattle: () => {
    return request.post('/arena/battle');
  },
};
