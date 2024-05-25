import { baseURL, httpGet, httpPost } from '../axios';
import { rsaEncrypt } from './encrypt';
import { useEffect, useState } from 'react';
import { showModal } from '@natsume_shiki/mika-ui';

let isUserLoggedIn = false;

const token = localStorage.getItem('token');
if (token) {
  isUserLoggedIn = true;
}

window.addEventListener('storage', () => {
  const newToken = localStorage.getItem('token');
  isUserLoggedIn = !!newToken;

  showModal({
    title: '登录状态改变',
    content: '登录状态已改变，请刷新页面',
    closeOnClickMask: false,
    closeIcon: false,
    footer: 'ok',
    onOk: () => {
      window.location.reload();
    },
  });
});

export const isUserLoggedInSync = () => isUserLoggedIn;

interface LoginRequest {
  user: string;
  password: string;
  verifyCodeId: string;
  captcha: string;
}

export const login = async ({ user, password, verifyCodeId, captcha }: LoginRequest) => {
  // eslint-disable-next-line no-param-reassign
  password = (await rsaEncrypt(password)) as string;
  // eslint-disable-next-line no-param-reassign
  captcha = captcha.toLowerCase();

  return httpPost<string>(
    '/user/login',
    {
      username: user,
      password,
      verifyCodeId,
      captcha,
    },
    undefined,
    false,
  ).then((res) => {
    if (res.code === 200) {
      localStorage.setItem('token', res.data!);
      isUserLoggedIn = true;
    }
    return res;
  });
};

export const getEmailCaptcha = (email: string) => httpPost(`/common/verify-email`, { email });
export const emailTimeLimit = 60 * 1000;

interface RegisterRequest {
  nickname: string;
  password: string;
  email: string;
  verifyCode: string;
}

export const register = async ({ nickname, password, email, verifyCode }: RegisterRequest) => {
  // eslint-disable-next-line no-param-reassign
  password = (await rsaEncrypt(password)) as string;

  return httpPost<string>(
    '/user/signup',
    {
      nickname,
      password,
      email,
      verifyCode,
    },
    undefined,
    false,
  ).then((res) => {
    if (res.code === 200) {
      localStorage.setItem('token', res.data!);
      isUserLoggedIn = true;
    }
    return res;
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  isUserLoggedIn = false;
};

interface Captcha {
  verifyCodeId: string;
  captcha: string;
}

export const getCaptcha = async () => httpGet<Captcha>('/common/captcha');

export const freshToken = async () =>
  httpGet<string>('/user/login/refresh').then((res) => {
    if (res.code === 200) {
      localStorage.setItem('token', res.data!);
      isUserLoggedIn = true;
    }
  });

let userInfo: {
  userId: 0;
  nickname: '';
  avatar: '';
  signature: '';
} | null = null;

export const getUserInfo = async () => {
  if (!isUserLoggedInSync()) {
    return null;
  }

  if (userInfo) {
    return userInfo;
  }

  const jwt = localStorage.getItem('token').split('.')[1];
  const payload = JSON.parse(atob(jwt));
  const { id } = payload.claims;
  return httpGet<typeof userInfo>(`/plain-user?uid=${id}`).then((res) => {
    if (res.code === 200) {
      userInfo = res.data;
    }
    return userInfo;
  });
};

export const modifyUserInfo = async (data: { nickname?: string; signature?: string; avatar?: File }) => {
  const formData = new FormData();
  data.nickname && formData.append('nickname', data.nickname);
  data.signature && formData.append('signature', data.signature);
  data.avatar && formData.append('avatar', data.avatar);

  return fetch(`${baseURL}/plain-user/update`, {
    method: 'POST',
    headers: {
      Token: `${localStorage.getItem('token')}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        const jwt = localStorage.getItem('token').split('.')[1];
        const payload = JSON.parse(atob(jwt));
        const { id } = payload.claims;
        return httpGet<typeof userInfo>(`/plain-user?uid=${id}`).then((res) => {
          if (res.code === 200) {
            userInfo = res.data;
          }
          return userInfo;
        });
      }
      return res;
    });
};

export const useUser = () => {
  const [user, setUser] = useState(userInfo);
  useEffect(() => {
    getUserInfo().then((res) => {
      if (res) {
        setUser(res);
      }
    });
  }, []);
  return user;
};
