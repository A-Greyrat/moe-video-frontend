import './Register.less';
import {useTitle, useTypePrint} from "../../common/hooks";
import {Button} from "../../component/mika-ui";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {emailTimeLimit, getEmailCaptcha, isUserLoggedIn, register} from "../../common/user";
import {useNavigate} from "react-router-dom";

const text =
    "「はじめまして」した日から\n" +
    "ずっと待っていた\n" +
    "この日を想っていた\n" +
    "キラキラその目に宿った\n" +
    "光を見たんだ\n" +
    "広がるこの大地を歩いて\n" +
    "新たな出会いに触れてきっと\n" +
    "見つけ出せる きみだけのジュエル\n" +
    "その軌跡をセーブ\n" +
    "全部全部 hurry up\n" +
    "赤青緑色とりどり\n" +
    "宝探し たまに寄り道\n" +
    "手合わせ願う それじゃ一緒に\n" +
    "３ ２ １\n" +
    "「キミにきめた」\n" +
    "今日も幕が開けた\n" +
    "Let meそうlet me feel\n" +
    "ドキドキがもう\n" +
    "止まらない止められない\n" +
    "磨き続けた\n" +
    "一撃をビリビリと今\n" +
    "狙い定めて keep it up\n" +
    "さあpick out\n" +
    "実りある瞬間を駆けるの\n" +
    "行こうno limit よ\n" +
    "ビリビリと今きみと\n" +
    "ジリジリを give me give me more\n" +
    "ヒリヒリの living living oh\n" +
    "ギリギリも楽しむの\n" +
    "金銀クリスタル\n" +
    "欲しいのはそんなんじゃないんだ\n" +
    "新人？リーダー？誰でも構わないや\n" +
    "蒼天の下 エメラルドの海超え\n" +
    "探し出す紅一点\n" +
    "難しい問題パスして\n" +
    "面白いが眠る街へ\n" +
    "白黒付ける 知ってるバトルの\n" +
    "How toならABCからXYZ\n" +
    "きみに会えた やっと巡り会えた\n" +
    "Let meそうlet me feel\n" +
    "ドキドキしてるの きみも同じかな\n" +
    "陽が差す朝も 月が見える夜も\n" +
    "積み上げてきたもの ぶつけ合おう\n" +
    "真剣勝負\n" +
    "どうしたってもう止まんない\n" +
    "夢に見たこのステージで\n" +
    "「キミにきめた」\n" +
    "待ち侘びたこの時をさあ\n" +
    "ドクドクと感じる\n" +
    "鼓動の先に行こう\n" +
    "磨き続けた\n" +
    "一撃をビリビリと今\n" +
    "狙い定めて keep it up\n" +
    "さあpick out\n" +
    "実りある瞬間にしよう\n" +
    "いつでもno limit よ\n" +
    "スカした顔のきみも\n" +
    "人見知りなきみも\n" +
    "下向いてた過去にバイバイを\n" +
    "未来をゲット\n" +
    "ビリビリと今きみと\n" +
    "ジリジリを give me give me more\n" +
    "ヒリヒリの living living oh\n" +
    "ギリギリも楽しむの\n";

const textArr = text.split("\n");
const newArr: string[] = [];

for (let i = 0; i < textArr.length / 3; i++) {
    newArr[i] = textArr[i * 3];
    if (i * 3 + 1 < textArr.length) {
        newArr[i] += "\n" + textArr[i * 3 + 1];
    }
    if (i * 3 + 2 < textArr.length) {
        newArr[i] += "\n" + textArr[i * 3 + 2];
    }
}

const useTimer = <T, >(callback: (arg: T) => void) => {
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
        }
    }, []);

    return [available, invoke.current] as const;
}
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
        return () => {
            clearTimeout(timer.current!);
        }
    }, [count]);

    return [count, reset.current] as const;
}

const TypePrinter = memo(({texts}: { texts: string[] }) => {
    const displayText = useTypePrint(texts, 100);
    return <p>{displayText}</p>;
}, (prev, next) => {
    return prev.texts === next.texts;
});

const validate = (form: HTMLFormElement) => {
    const email = form.email;
    const nickname = form.nickname;
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    const verifyCode = form.verifyCode;

    if (!email.checkValidity()) {
        return "邮箱格式错误";
    }

    if (!nickname.checkValidity()) {
        return "昵称格式错误";
    }

    if (!password.value) {
        return "密码不能为空";
    }

    if (!password.checkValidity()) {
        return "密码强度不够，至少6位，包含字母和数字";
    }

    if (password.value !== confirmPassword.value) {
        return "输入的两次密码不一致";
    }

    if (!verifyCode.checkValidity()) {
        return "验证码不能为空";
    }

    return null;
}


const RegisterForm = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const nav = useNavigate();
    const [count, reset] = useCountDown(emailTimeLimit / 1000);
    const [error, setError] = useState<string | null>(null);
    const [disable, setDisable] = useState(false);
    const [available, invoke] = useTimer((email: string) => {
        getEmailCaptcha(email).then(() => {
            setError("验证码已发送");
        }).catch(() => {
            setError("验证码发送失败");
        });

        reset(emailTimeLimit / 1000);
    });

    const getEmailCaptchaCallback = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const email = emailRef.current!.value;
        if (!email) {
            setError("邮箱不能为空");
            return;
        }

        invoke?.(emailTimeLimit, email);
    }, [invoke]);

    const submitCallback = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDisable(true);
        const form = new FormData(e.currentTarget.form!);

        const error = validate(e.currentTarget.form!);
        if (error) {
            setError(error);
            setDisable(false);
            return;
        }

        return register({
            email: (form.get("email") as string).trim(),
            nickname: (form.get("nickname") as string).trim(),
            password: (form.get("password") as string).trim(),
            verifyCode: (form.get("verifyCode") as string).trim(),
        }).then(res => {
            setDisable(false);
            if (res.code === 200) {
                nav(-1);
            } else {
                setError(res.msg);
            }
        });
    }, [nav]);

    return (
        <form className="moe-video-register-form" method='post'>
            <input type="email" placeholder="邮箱" name="email" ref={emailRef} required/>
            <input type="text" placeholder="昵称" name="nickname" required pattern={"^[\u4e00-\u9fa5_a-zA-Z0-9]+$"}/>
            <input type="password" placeholder="密码" name="password" required
                   pattern={"^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"}/>
            <input type="password" placeholder="确认密码" name="confirmPassword" required/>
            <div className="moe-video-register-form-captcha">
                <input type="text" placeholder="验证码" name="verifyCode" required/>
                <button disabled={!available.current} onClick={getEmailCaptchaCallback}>
                    {available.current ? '获取验证码' : count + "s"}
                </button>
            </div>
            <div className="moe-video-register-form-error">
                {error}
            </div>
            <Button disabled={disable} type="submit" styleType="primary" size="large"
                    onClick={submitCallback}>注册</Button>
        </form>
    );
}

const Register = () => {
    const nav = useNavigate();
    useTitle("注册");

    useEffect(() => {
        if (isUserLoggedIn) {
            nav("/");
        }
    }, [nav]);

    return (<div className="moe-video-register-root">
        <div className="moe-video-register-container">
            <div>
                <h1>注 册</h1>
                <RegisterForm/>
            </div>
        </div>
        <div className="mika-novel-register-side">
            <TypePrinter texts={newArr}/>
        </div>
    </div>);
}

export default Register;
