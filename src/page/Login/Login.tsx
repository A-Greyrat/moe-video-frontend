import { Button, Image, Input, showModal } from '@natsume_shiki/mika-ui';
import './Login.less';
import { useTypePrint } from '../../common/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { forgetPassword, getCaptcha, getEmailCaptcha, isUserLoggedInSync, login } from '../../common/user';
import { throttle } from '../../common/utils';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'mika-store';

const text =
  '私は誰　あなたの哀れ\n' +
  '夜空の中で　名前を無くして\n' +
  'うねりのない　水面に潜む景色を\n' +
  '知らないまま　漂う雲\n' +
  '昨日までは　漂う雲\n' +
  '霧になってしまっても\n' +
  '別にいいのに　構わないのに\n' +
  '私はなぜ　真っすぐに落ちる\n' +
  'だれかの手のひらを探すため\n' +
  '空をできる限り　目に収めながら\n' +
  '私は雨　弾かれて判る\n' +
  'だれかのようにはなれない雨\n' +
  '地球を困らせるほどの痛みを知らないから\n' +
  '私は雨　セカイを暈す\n' +
  '夜明けに導かれている雨\n' +
  '流れ着いた海の隠し味を知るまで\n' +
  '星を隠した雷鳴と\n' +
  '視界からはみ出した　積乱雲\n' +
  'できるだけ　できるだけ　できるだけ\n' +
  '離れていたかった\n' +
  '傘をさす　余裕はないし\n' +
  'このままでもいいと思えるよ\n' +
  'わからないから　染み込んでるの\n' +
  '夜の強い雨で　目を覚ます\n' +
  '私は雨　地球をなぞる\n' +
  '一粒では気付くことのない雨\n' +
  '夜空に飾り付ける　星を見つけて\n' +
  '空に浮かんだり　地に足をつけたり\n' +
  '消えかかったり　溢れかえったりする\n' +
  '描けていたら　何も起きなかった\n' +
  'セカイ的気候変動\n' +
  '私は雨　滴って判る\n' +
  'だれかのようにはなれない雨\n' +
  '地球を困らせるほどの思いを知りたいから\n' +
  '私は雨　セカイを暈す\n' +
  '夜明けに導かれている雨\n' +
  '流れ着いた海の隠し味になるまで\n' +
  '私は雨\n' +
  '辿り着くまでに\n' +
  'おさらいを忘れないで\n' +
  '凪の海で向かい合わせ\n' +
  '違う景色　同じ模様の　答え合わせ';

const textArr = text.split('\n');
const newArr: string[] = [];

for (let i = 0; i < textArr.length / 3; i++) {
  newArr[i] = textArr[i * 3];
  if (i * 3 + 1 < textArr.length) {
    newArr[i] += `\n${textArr[i * 3 + 1]}`;
  }
  if (i * 3 + 2 < textArr.length) {
    newArr[i] += `\n${textArr[i * 3 + 2]}`;
  }
}

const TypePrinter = ({ texts }: { texts: string[] }) => {
  const displayText = useTypePrint(texts, 100);
  return <p>{displayText}</p>;
};

interface CaptchaData {
  verifyCodeId: string | null;
  captcha: string | null;
}

export const Captcha = () => {
  const [captcha, setCaptcha] = useStore<CaptchaData>('captcha');
  const lock = useRef(false);

  const resetCaptcha = useCallback(() => {
    if (lock.current) {
      return;
    }
    lock.current = true;
    getCaptcha()
      .then((res) => {
        if (res.code === 200) {
          setCaptcha(res.data);
        } else {
          setCaptcha({
            verifyCodeId: null,
            captcha: null,
          });
        }
      })
      .finally(() => {
        lock.current = false;
      });
  }, [setCaptcha]);

  const renewCaptcha: (arg: unknown) => void = useCallback(throttle(resetCaptcha, 1000), [resetCaptcha]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_resetCaptchaCallback, _setResetCaptchaCallback] = useStore<() => unknown>('reset-captcha', () => () => {
    resetCaptcha();
  });

  useEffect(() => {
    document.title = '登录';

    resetCaptcha();
  }, [resetCaptcha]);

  return (
    <div
      onClick={() => {
        setCaptcha({
          verifyCodeId: null,
          captcha: null,
        });
        renewCaptcha([]);
      }}
    >
      <input type='hidden' name='verifyCodeId' value={captcha?.verifyCodeId ?? ''} />
      <Image src={captcha?.captcha} alt='验证码' width='100px' height='40px' />
    </div>
  );
};

export const SubmitButton = () => {
  const [showError, setShowError] = useState<string | null>(null);
  const [disable, setDisable] = useState(false);
  const nav = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_captcha, setCaptcha] = useStore<CaptchaData>('captcha');
  const lock = useRef(false);

  const resetCaptcha = useCallback(() => {
    if (lock.current) {
      return;
    }
    lock.current = true;
    getCaptcha()
      .then((res) => {
        if (res.code === 200) {
          setCaptcha(res.data);
        } else {
          setCaptcha({
            verifyCodeId: null,
            captcha: null,
          });
        }
      })
      .finally(() => {
        lock.current = false;
      });
  }, [setCaptcha]);

  const loginCallback = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      setDisable(true);
      const form = new FormData(e.currentTarget.form as HTMLFormElement);
      // eslint-disable-next-line no-use-before-define
      const error = validate(e.currentTarget.form as HTMLFormElement);

      if (error) {
        setShowError(error);
        setDisable(false);
        return;
      }

      const data = {
        user: (form.get('username') as string).trim(),
        password: (form.get('password') as string).trim(),
        captcha: (form.get('captcha') as string).trim(),
        verifyCodeId: (form.get('verifyCodeId') as string).trim(),
      };

      // eslint-disable-next-line consistent-return
      return login(data).then((res) => {
        setDisable(false);

        if (res.code === 200) {
          nav(-1);
        } else {
          setShowError(res.msg);
          resetCaptcha();
        }
      });
    },
    [nav, resetCaptcha],
  );

  return (
    <>
      <div className='moe-video-login-form-error'>{showError}</div>
      <div className='moe-video-login-form-btn-container'>
        <Button disabled={disable} type='submit' styleType='primary' size='large' onClick={loginCallback}>
          登录
        </Button>
        <div>
          <Button
            styleType='link'
            size='medium'
            onClick={(e) => {
              e.preventDefault();
              showModal({
                title: '忘记密码',
                content: (
                  <form className='moe-video-login-form-forget-password' onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <p className='text-gray-500'>邮箱</p>
                      <div className='flex justify-between gap-4'>
                        <div className='flex-auto'>
                          <Input size='small' name='email' />
                        </div>
                        <Button
                          className='w-20'
                          styleType='primary'
                          size='small'
                          onClick={async (e) => {
                            e.preventDefault();
                            const form = document.querySelector(
                              '.moe-video-login-form-forget-password',
                            ) as HTMLFormElement;
                            const email = form.querySelector('input[name="email"]') as HTMLInputElement;
                            if (
                              !email?.value ||
                              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)
                            ) {
                              showModal({
                                title: '发送失败',
                                content: '邮箱格式错误',
                                closeIcon: false,
                                closeOnClickMask: true,
                              });
                              return;
                            }

                            // eslint-disable-next-line consistent-return
                            return getEmailCaptcha(email.value).then((res) => {
                              if (res.code === 200) {
                                showModal({
                                  title: '发送成功',
                                  content: '请查看邮箱',
                                  closeIcon: false,
                                  closeOnClickMask: true,
                                });
                              } else {
                                showModal({
                                  title: '发送失败',
                                  content: res.msg,
                                  closeIcon: false,
                                  closeOnClickMask: true,
                                });
                              }
                            });
                          }}
                        >
                          发送
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className='text-gray-500'>验证码</p>
                      <Input size='small' name='code' />
                    </div>
                    <div>
                      <p className='text-gray-500'>新密码</p>
                      <Input size='small' name='pwd' />
                    </div>
                    <Button
                      styleType='primary'
                      size='large'
                      className='mt-2'
                      onClick={async (e) => {
                        e.preventDefault();
                        const form = document.querySelector('.moe-video-login-form-forget-password') as HTMLFormElement;
                        const email = form.querySelector('input[name="email"]') as HTMLInputElement;
                        const code = form.querySelector('input[name="code"]') as HTMLInputElement;
                        const pwd = form.querySelector('input[name="pwd"]') as HTMLInputElement;

                        if (!email?.value || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
                          showModal({
                            title: '修改失败',
                            content: '邮箱格式错误',
                            closeIcon: false,
                            closeOnClickMask: true,
                          });
                          return;
                        }
                        if (!code?.value || !/^[0-9]{6}$/.test(code.value)) {
                          showModal({
                            title: '修改失败',
                            content: '验证码格式错误',
                            closeIcon: false,
                            closeOnClickMask: true,
                          });
                          return;
                        }

                        if (!pwd?.value || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pwd.value)) {
                          showModal({
                            title: '修改失败',
                            content: '密码格式错误',
                            closeIcon: false,
                            closeOnClickMask: true,
                          });
                          return;
                        }

                        // eslint-disable-next-line consistent-return
                        return forgetPassword(email.value, code.value, pwd.value).then((res) => {
                          if (res.code === 200) {
                            showModal({
                              title: '修改成功',
                              content: '请重新登录',
                              closeIcon: false,
                              closeOnClickMask: true,
                              onClose: () => {
                                window.location.reload();
                              },
                            });
                          } else {
                            showModal({
                              title: '修改失败',
                              content: res.msg,
                              closeIcon: false,
                              closeOnClickMask: true,
                            });
                          }
                        });
                      }}
                    >
                      修改
                    </Button>
                  </form>
                ),
                closeOnClickMask: true,
                closeIcon: false,
              });
            }}
          >
            忘记密码
          </Button>
          <Button
            styleType='link'
            size='medium'
            onClick={(e) => {
              e.preventDefault();
              nav('/register');
            }}
          >
            注册
          </Button>
        </div>
      </div>
    </>
  );
};

const validate = (form: HTMLFormElement) => {
  const username = form.username as HTMLInputElement;
  const password = form.password as HTMLInputElement;
  const captcha = form.captcha as HTMLInputElement;

  if (!username.checkValidity()) {
    return '邮箱格式错误';
  }
  if (!password.checkValidity()) {
    return '密码为空';
  }
  if (!captcha.checkValidity()) {
    return '验证码格式错误';
  }

  return null;
};

const Login = () => {
  const nav = useNavigate();

  useEffect(() => {
    if (isUserLoggedInSync()) {
      nav('/');
    }
  }, [nav]);

  return (
    <div className='moe-video-login-root'>
      <div className='moe-video-login-side'>
        <TypePrinter texts={newArr} />
      </div>
      <div className='moe-video-login-container'>
        <div className='moe-video-login-form-container'>
          <h1>登 录</h1>
          <form
            className='moe-video-login-form'
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input type='email' placeholder='邮箱' name='username' required />
            <input type='password' placeholder='密码' name='password' required />
            <div className='moe-video-login-form-captcha'>
              <input type='text' placeholder='验证码' name='captcha' required pattern={'^[a-zA-Z0-9]{4}$'} />
              <Captcha />
            </div>
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
