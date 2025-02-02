import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';

// 定义响应数据的基本结构
interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建axios实例
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const res = response.data as BaseResponse;
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          message.error('登录已过期，请重新登录');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        default:
          message.error('请求失败，请稍后重试');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 封装通用请求方法
const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return http.get<any, T>(url, config);
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return http.post<any, T>(url, data, config);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return http.put<any, T>(url, data, config);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return http.delete<any, T>(url, config);
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return http.patch<any, T>(url, data, config);
  }
};

export default request;