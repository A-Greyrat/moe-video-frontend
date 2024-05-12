import axios, {AxiosRequestConfig} from 'axios';
import {showModal, withLock} from "@natsume_shiki/mika-ui";
import {isUserLoggedIn} from "../user";

export const baseURL = 'https://abdecd.xyz/moe';
const instance = axios.create({
    baseURL: baseURL,
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const expireModal = withLock((_lock: boolean) => {
    showModal({
        title: "登录过期",
        content: "登录已过期，请重新登录",
        onOk: () => {
            _lock = false;
            localStorage.removeItem("token");
            window.location.reload();
        },
        closeIcon: false,
        closeOnClickMask: false,
        footer: "ok",
    });
});

instance.interceptors.response.use(response => {
    if (response.headers['token']) {
        localStorage.setItem('token', response.headers['token']);
    }
    return response;
}, error => {
    if (error.response.status === 401) {
        if (isUserLoggedIn) {
            expireModal();
        }
    }
    return Promise.reject(error);
});

export const httpGet = async <T, >(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T | null>> => {
    return instance.get(url, config)
        .then(res => res.data as ResponseData<T>)
        .catch(res => {
            return {
                code: res.response?.status || 400,
                data: null,
                msg: res.response?.data
            }
        });
}

export const httpPost = async <T, >(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ResponseData<T | null>> => {
    config = config || {};
    config.headers = {
        'Content-Type': 'application/json',
    };

    return instance.post(url, data, config)
        .then(res => res.data as ResponseData<T>)
        .catch(res => {
            return {
                code: res.response?.status,
                data: null,
                msg: res.response?.data
            }
        });
}

export interface ResponseData<T> {
    code: number;
    msg: string;
    data: T;
}

export const errorResponse: ResponseData<null> = {
    code: 400,
    data: null,
    msg: '网络错误',
};

export default instance;
