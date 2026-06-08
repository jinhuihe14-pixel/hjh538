import request from './request';

export interface EquipItem {
  id: string;
  equipId: number;
  name: string;
  slot: number;
  rarity: number;
  level: number;
  mainAttr: { attr: string; value: number; isPercent: boolean };
  subAttrs: Array<{ attr: string; value: number; isPercent: boolean }>;
  heroId?: string;
  isLocked: boolean;
}

export const equipmentApi = {
  getList: (page = 1, pageSize = 20) => {
    return request.get<any, { list: EquipItem[]; total: number; page: number; pageSize: number }>(
      '/equipment/list',
      { params: { page, pageSize } },
    );
  },

  getDetail: (id: string) => {
    return request.get<any, EquipItem & { description: string; exp: number }>(
      `/equipment/${id}`,
    );
  },

  equipOnHero: (equipId: string, heroId: string) => {
    return request.post(`/equipment/${equipId}/equip`, { heroId });
  },

  unequipFromHero: (equipId: string) => {
    return request.post(`/equipment/${equipId}/unequip`);
  },
};
