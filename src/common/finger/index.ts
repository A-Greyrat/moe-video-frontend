import { addFeedback } from '../video';

function getBrowserFingerprint() {
  const navigatorInfo = window.navigator;
  const screenInfo = window.screen;
  return {
    userAgent: navigatorInfo.userAgent, // 浏览器的用户代理字符串
    language: navigatorInfo.language, // 浏览器首选语言
    platform: navigatorInfo.platform, // 浏览器平台
    screenWidth: screenInfo.width, // 屏幕宽度
    screenHeight: screenInfo.height, // 屏幕高度
    colorDepth: screenInfo.colorDepth, // 屏幕颜色深度
    timezoneOffset: new Date().getTimezoneOffset(), // 本地时间与UTC时间的差值，以分钟计
    sessionStorage: !!window.sessionStorage, // 是否支持sessionStorage
    localStorage: !!window.localStorage, // 是否支持localStorage
    indexedDB: !!window.indexedDB, // 是否支持IndexedDB
    cookiesEnabled: navigatorInfo.cookieEnabled, // 是否启用了cookies
  };
}

export function statistics() {
  if (localStorage.getItem('fp') === null) {
    localStorage.setItem('fp', JSON.stringify(getBrowserFingerprint()));
    addFeedback(JSON.stringify(getBrowserFingerprint()), 'fp@erisu.moe');
  }
}
