import request from './request';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    nickname: string;
    avatar: string | null;
    level: number;
    vipLevel: number;
  };
}

export interface UserInfoResponse {
  id: string;
  username: string;
  nickname: string;
  avatar: string | null;
  level: number;
  exp: number;
  vipLevel: number;
  resources: {
    gold: number;
    silver: number;
    food: number;
    diamond: number;
    stamina: number;
  };
}

export const userApi = {
  register: (username: string, password: string, nickname?: string) => {
    return request.post<any, LoginResponse>('/user/register', {
      username,
      password,
      nickname,
    });
  },

  login: (username: string, password: string) => {
    return request.post<any, LoginResponse>('/user/login', {
      username,
      password,
    });
  },

  logout: () => {
    return request.post('/user/logout');
  },

  getInfo: () => {
    return request.get<any, UserInfoResponse>('/user/info');
  },
};
