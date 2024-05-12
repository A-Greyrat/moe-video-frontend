import {httpGet, httpPost} from '../axios';
import {rsaEncrypt} from './encrypt';
import {useEffect, useState} from "react";

export let isUserLoggedIn = false;

const token = localStorage.getItem("token");
if (token) {
    isUserLoggedIn = true;
}

interface LoginRequest {
    user: string,
    password: string,
    verifyCodeId: string,
    captcha: string,
}

export const login = async ({user, password, verifyCodeId, captcha}: LoginRequest) => {
    password = await rsaEncrypt(password) as string;
    captcha = captcha.toLowerCase();

    return httpPost<string>("/user/login", {
        "username": user,
        "password": password,
        "verifyCodeId": verifyCodeId,
        "captcha": captcha
    }).then(res => {
        if (res.code === 200) {
            localStorage.setItem("token", res.data!);
            isUserLoggedIn = true;
        }
        return res;
    })
}

export const getEmailCaptcha = (email: string) => httpPost(`/common/verify-email`, {email});
export const emailTimeLimit = 60 * 1000;

interface RegisterRequest {
    nickname: string,
    password: string,
    email: string,
    verifyCode: string,
}

export const register = async ({nickname, password, email, verifyCode}: RegisterRequest) => {
    password = await rsaEncrypt(password) as string;

    return httpPost<string>("/user/signup", {
        "nickname": nickname,
        "password": password,
        "email": email,
        "verifyCode": verifyCode
    }).then(res => {
        if (res.code === 200) {
            localStorage.setItem("token", res.data!);
            isUserLoggedIn = true;
        }
        return res;
    })

}

export const logout = () => {
    localStorage.removeItem("token");
    isUserLoggedIn = false;
}

interface Captcha {
    verifyCodeId: string;
    captcha: string;
}

export const getCaptcha = async () => {
    return httpGet<Captcha>("/common/captcha");
}

export const freshToken = async () => {
    return httpGet<string>("/user/login/refresh").then(res => {
        if (res.code === 200) {
            localStorage.setItem("token", res.data!);
            isUserLoggedIn = true;
        }
    })
}

let userInfo: {
    userId: 0,
    nickname: "",
    avatar: "",
    signature: ""
} | null = null;


export const getUserInfo = async () => {
    if (!isUserLoggedIn) {
        return null;
    }

    if (userInfo) {
        return userInfo;
    }

    const jwt = localStorage.getItem("token").split(".")[1];
    const payload = JSON.parse(atob(jwt));
    const id = payload.claims.id;
    return httpGet<typeof userInfo>("/plain-user?uid=" + id).then(res => {
        if (res.code === 200) {
            userInfo = res.data;
        }
        return userInfo;
    });
}

export const useUser = () => {
    const [user, setUser] = useState(userInfo);
    useEffect(() => {
        getUserInfo().then(res => {
            if (res) {
                setUser(res);
            }
        });
    }, []);
    return user;
}

getUserInfo().then(res => {
    console.log(res);

});
