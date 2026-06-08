import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useUserStore } from '../stores/userStore';
import { Toast } from 'antd-mobile';

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.code === 0) {
      return data.data;
    } else {
      Toast.show({
        icon: 'fail',
        content: data.message || '请求失败',
      });
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      useUserStore.getState().clearAuth();
      window.location.href = '/login';
      Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' });
    } else {
      Toast.show({
        icon: 'fail',
        content: message || '网络错误',
      });
    }

    return Promise.reject(error);
  },
);

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export default request;
