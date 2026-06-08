import request from './request';

export interface CityInfo {
  id: string;
  userId: string;
  mainHallLevel: number;
  buildings: Record<string, BuildingInfo>;
  defenders: string[];
  wallDefense: number;
  wallMaxDefense: number;
  production: {
    silverPerSec: number;
    foodPerSec: number;
  };
  offlineProfit: {
    silver: number;
    food: number;
    seconds: number;
  };
}

export interface BuildingInfo {
  level: number;
  isUpgrading: boolean;
  upgradeStartAt?: string;
  upgradeEndAt?: string;
}

export const cityApi = {
  getCity: () => {
    return request.get<any, CityInfo>('/city');
  },

  collectResources: () => {
    return request.post<any, { silver: number; food: number; seconds: number }>(
      '/city/collect',
    );
  },

  upgradeBuilding: (buildingType: string) => {
    return request.post('/city/upgrade', { buildingType });
  },
};
