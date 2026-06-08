import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string | null;
  level: number;
  vipLevel: number;
}

interface UserState {
  token: string;
  userInfo: UserInfo | null;
  setToken: (token: string) => void;
  setUserInfo: (info: UserInfo) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: '',
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (info) => set({ userInfo: info }),
      clearAuth: () => set({ token: '', userInfo: null }),
      initAuth: () => {
        const state = get();
        if (!state.token) {
          set({ token: '', userInfo: null });
        }
      },
    }),
    {
      name: 'user-storage',
    },
  ),
);
