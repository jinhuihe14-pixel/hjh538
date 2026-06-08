import request from './request';

export interface HeroItem {
  id: string;
  heroId: number;
  name: string;
  rarity: number;
  profession: number;
  camp: number;
  level: number;
  star: number;
  quality: number;
  pos: number;
  isLocked: boolean;
}

export interface HeroDetail extends HeroItem {
  attrs: Record<string, number>;
  description: string;
}

export const heroApi = {
  getList: () => {
    return request.get<any, HeroItem[]>('/hero/list');
  },

  getDetail: (id: string) => {
    return request.get<any, HeroDetail>(`/hero/detail/${id}`);
  },

  getLineup: () => {
    return request.get<any, HeroItem[]>('/hero/lineup');
  },

  setLineup: (heroIds: string[]) => {
    return request.post('/hero/lineup', { heroIds });
  },

  getPower: () => {
    return request.get<any, { power: number }>('/hero/power');
  },
};
