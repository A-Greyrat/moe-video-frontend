import axios, { AxiosRequestConfig } from 'axios';
import { showModal, withLock } from '@natsume_shiki/mika-ui';
import { isUserLoggedInSync } from '../user';

export interface ResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

export const baseURL = 'https://abdecd.xyz/moe';
const instance = axios.create({
  baseURL,
});

const RETRY_COUNT = 5;

const retry = async (fn: () => Promise<any>, count: number) => {
  const res = await fn();
  if (res.code !== 200 && res.code !== 401) {
    if (count <= 0) return Promise.reject(res);
    return retry(fn, count - 1);
  }
  return res;
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const expireModal = withLock((_lock: boolean) => {
  showModal({
    title: '登录过期',
    content: '登录已过期，请重新登录',
    onOk: () => {
      // eslint-disable-next-line no-param-reassign
      _lock = false;
      localStorage.removeItem('token');
      window.location.reload();
    },
    onClose: () => {
      // eslint-disable-next-line no-param-reassign
      _lock = false;
      localStorage.removeItem('token');
      window.location.reload();
    },
    closeIcon: false,
    closeOnClickMask: false,
    footer: 'ok',
  });
});

instance.interceptors.response.use(
  (response) => {
    if (response.headers.token) {
      localStorage.setItem('token', response.headers.token);
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      if (isUserLoggedInSync()) {
        expireModal();
      }
    }
    return Promise.reject(error);
  },
);

// eslint-disable-next-line no-use-before-define
export const httpGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T | null>> =>
  retry(
    () =>
      instance
        .get(url, config)
        .then((res) => res.data as ResponseData<T>)
        .catch((res) => ({
          code: res.response?.status || 400,
          data: null,
          msg: res.response?.data?.msg || '',
        })),
    RETRY_COUNT,
  );

export const httpPost = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ResponseData<T | null>> => {
  // eslint-disable-next-line no-param-reassign
  config = config || {};
  config.headers = {
    'Content-Type': 'application/json',
  };

  return retry(
    () =>
      instance
        .post(url, data, config)
        .then((res) => res.data as ResponseData<T>)
        .catch((res) => ({
          code: res.response?.status,
          data: null,
          msg: res.response?.data.msg,
        })),
    RETRY_COUNT,
  );
};

export const httpPostForm = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ResponseData<T | null>> => {
  // eslint-disable-next-line no-param-reassign
  config = config || {};
  config.headers = {
    'Content-Type': 'multipart/form-data',
  };

  return instance
    .post(url, data, config)
    .then((res) => res.data as ResponseData<T>)
    .catch((res) => ({
      code: res.response?.status,
      data: null,
      msg: res.response?.data.msg,
    }));
};

export const errorResponse: ResponseData<null> = {
  code: 400,
  data: null,
  msg: '网络错误',
};

export default instance;
