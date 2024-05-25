import './Register.less';
import { useTitle, useTypePrint } from '../../common/hooks';
import { Button } from '@natsume_shiki/mika-ui';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { emailTimeLimit, getEmailCaptcha, isUserLoggedInSync, register } from '../../common/user';
import { useNavigate } from 'react-router-dom';

const text =
  '離れ離れの街を繋ぐ列車は\n' +
  '行ってしまったね\n' +
  '失くした言葉を知らないなら\n' +
  'ポケットで握りしめて\n' +
  'あがいた息を捨てて延びる今日は\n' +
  '眠って誤魔化せ\n' +
  '失くした言葉を知らないなら\n' +
  '各駅停車に乗り込んで\n' +
  '夕方と退屈のお誘いを断って\n' +
  '一人きり路地裏は\n' +
  '決して急がないで\n' +
  'ほら 横断歩道も\n' +
  '待ってくれと言ってる\n' +
  '見張る街角が\n' +
  'あなたを引き留めてく\n' +
  '離れ離れの街を繋ぐ列車は\n' +
  '行ってしまったね\n' +
  '失くした言葉を知らないなら\n' +
  'ポケットで握りしめて\n' +
  'あがいた夢を捨てて揺れる今日は\n' +
  '眠って誤魔化せ\n' +
  '失くした言葉を知らないなら\n' +
  '各駅停車に乗り込んで\n' +
  '夕方の駅のホームは\n' +
  'ひどく混み合って\n' +
  'ひとり占めできるまで\n' +
  '休憩して欲しくて\n' +
  'また 集団下校が\n' +
  'あなたを急かしている\n' +
  'ほら 自動改札は\n' +
  '待ってくれと言ってる\n' +
  '塞がる両手が\n' +
  'あなたを引き留めてく\n' +
  'あがいた夢を捨てて揺れる今日は\n' +
  '眠って誤魔化せ\n' +
  '失くした言葉を知らないなら\n' +
  '各駅停車に乗り込んで\n' +
  '離れた街と街を繋ぐ列車が\n' +
  '呼んだ風に\n' +
  '飛ばされないでいてくれ\n' +
  '失くした言葉はそのままでいいよ\n' +
  '揺れる列車に\n' +
  '身を任せて欲しいから\n' +
  '離れ離れの街を\n' +
  '離れ離れの街を繋ぐ列車は\n' +
  '行ってしまったね\n' +
  '失くした言葉を知らないなら\n' +
  'ポケットで握りしめて\n' +
  'あがいた息を捨てて延びる今日は\n' +
  '眠って誤魔化せ\n' +
  '失くした言葉を知らないなら\n' +
  '各駅停車で旅をして\n';

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

const useTimer = <T,>(callback: (arg: T) => void) => {
  const savedCallback = useRef<(arg: T) => void>();
  const available = useRef(true);
  const invoke = useRef<(time: number, arg: T) => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    invoke.current = (time: number, arg: T) => {
      if (available.current) {
        available.current = false;
        setTimeout(() => {
          available.current = true;
        }, time);
        savedCallback.current?.(arg);
      }
    };
  }, []);

  return [available, invoke.current] as const;
};
const useCountDown = (time: number) => {
  const [count, setCount] = useState(time);
  const timer = useRef<number | null>(null);
  const reset = useRef<(time: number) => void>((time: number) => {
    setCount(time);
  });

  useEffect(() => {
    if (count === 0) {
      clearTimeout(timer.current!);
      return;
    }
    timer.current = setTimeout(() => {
      setCount(count - 1);
    }, 1000) as unknown as number;
    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer.current!);
    };
  }, [count]);

  return [count, reset.current] as const;
};

const TypePrinter = memo(
  ({ texts }: { texts: string[] }) => {
    const displayText = useTypePrint(texts, 100);
    return <p>{displayText}</p>;
  },
  (prev, next) => prev.texts === next.texts,
);

const validate = (form: HTMLFormElement) => {
  const { email, password, nickname, verifyCode, confirmPassword } = form;

  if (!email.checkValidity()) {
    return '邮箱格式错误';
  }

  if (!nickname.checkValidity()) {
    return '昵称格式错误';
  }

  if (!password.value) {
    return '密码不能为空';
  }

  if (!password.checkValidity()) {
    return '密码强度不够，至少6位，包含字母和数字';
  }

  if (password.value !== confirmPassword.value) {
    return '输入的两次密码不一致';
  }

  if (!verifyCode.checkValidity()) {
    return '验证码不能为空';
  }

  return null;
};

const RegisterForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const [count, reset] = useCountDown(emailTimeLimit / 1000);
  const [error, setError] = useState<string | null>(null);
  const [disable, setDisable] = useState(false);
  const [available, invoke] = useTimer((email: string) => {
    getEmailCaptcha(email)
      .then(() => {
        setError('验证码已发送');
      })
      .catch(() => {
        setError('验证码发送失败');
      });

    reset(emailTimeLimit / 1000);
  });

  const getEmailCaptchaCallback = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const email = emailRef.current!.value;
      if (!email) {
        setError('邮箱不能为空');
        return;
      }

      if (!emailRef.current!.checkValidity()) {
        setError('邮箱格式错误');
        return;
      }

      invoke?.(emailTimeLimit, email);
    },
    [invoke],
  );

  const submitCallback = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDisable(true);
      const form = new FormData(e.currentTarget.form!);

      const error = validate(e.currentTarget.form!);
      if (error) {
        setError(error);
        setDisable(false);
        return;
      }

      // eslint-disable-next-line consistent-return
      return register({
        email: (form.get('email') as string).trim(),
        nickname: (form.get('nickname') as string).trim(),
        password: (form.get('password') as string).trim(),
        verifyCode: (form.get('verifyCode') as string).trim(),
      })
        .then((res) => {
          setDisable(false);
          if (res.code === 200) {
            nav(-1);
          } else {
            setError(res.msg);
          }
        })
        .catch(() => {
          setDisable(false);
          setError('注册失败');
        });
    },
    [nav],
  );

  return (
    <form
      className='moe-video-register-form'
      method='post'
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input type='email' placeholder='邮箱' name='email' ref={emailRef} required />
      <input type='text' placeholder='昵称' name='nickname' required pattern={'^[\u4e00-\u9fa5_a-zA-Z0-9]+$'} />
      <input
        type='password'
        placeholder='密码'
        name='password'
        required
        pattern={'^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'}
      />
      <input type='password' placeholder='确认密码' name='confirmPassword' required />
      <div className='moe-video-register-form-captcha'>
        <input type='text' placeholder='验证码' name='verifyCode' required />
        <button disabled={!available.current} onClick={getEmailCaptchaCallback}>
          {available.current ? '获取验证码' : `${count}s`}
        </button>
      </div>
      <div className='moe-video-register-form-error'>{error}</div>
      <Button disabled={disable} type='submit' styleType='primary' size='large' onClick={submitCallback}>
        注册
      </Button>
    </form>
  );
};

const Register = () => {
  const nav = useNavigate();
  useTitle('注册');

  useEffect(() => {
    if (isUserLoggedInSync()) {
      nav('/');
    }
  }, [nav]);

  return (
    <div className='moe-video-register-root'>
      <div className='moe-video-register-container'>
        <div>
          <h1>注 册</h1>
          <RegisterForm />
        </div>
      </div>
      <div className='mika-novel-register-side'>
        <TypePrinter texts={newArr} />
      </div>
    </div>
  );
};

export default Register;
