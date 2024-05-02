import {Button, Image, showModal} from "../../component/mika-ui";
import "./Login.less";
import {useTypePrint} from "../../common/hooks";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {getCaptcha, isUserLoggedIn, login} from "../../common/user";
import {throttle} from "../../common/utils";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../common/mika-store";

const text =
    "無敵の笑顔で荒らすメディア\n" +
    "知りたいその秘密ミステリアス\n" +
    "抜けてるとこさえ彼女のエリア\n" +
    "完璧で嘘つきな君は\n" +
    "天才的なアイドル様\n" +
    "今日何食べた?\n" +
    "好きな本は?\n" +
    "遊びに行くならどこに行くの?\n" +
    "何も食べてない\n" +
    "それは内緒\n" +
    "何を聞かれてものらりくらり\n" +
    "そう淡々と\n" +
    "だけど燦々と\n" +
    "見えそうで見えない秘密は蜜の味\n" +
    "あれもないないない\n" +
    "これもないないない\n" +
    "好きなタイプは?\n" +
    "相手は?\n" +
    "さあ答えて\n" +
    "「誰かを好きになることなんて\n" +
    "私分からなくてさ」\n" +
    "嘘か本当か知り得ない\n" +
    "そんな言葉にまた一人堕ちる\n" +
    "また好きにさせる\n" +
    "誰もが目を奪われていく\n" +
    "君は完璧で究極のアイドル\n" +
    "金輪際現れない\n" +
    "一番星の生まれ変わり\n" +
    "その笑顔で愛してるで\n" +
    "誰も彼も虜にしていく\n" +
    "その瞳がその言葉が\n" +
    "嘘でもそれは完全なアイ\n" +
    "はいはいあの子は特別です\n" +
    "我々はハナからおまけです\n" +
    "お星様の引き立て役Bです\n" +
    "全てがあの子のお陰なわけない\n" +
    "洒落臭い\n" +
    "妬み嫉妬なんてないわけがない\n" +
    "これはネタじゃない\n" +
    "からこそ許せない\n" +
    "完璧じゃない君じゃ許せない\n" +
    "自分を許せない\n" +
    "誰よりも強い君以外は認めない\n" +
    "誰もが信じ崇めてる\n" +
    "まさに最強で無敵のアイドル\n" +
    "弱点なんて見当たらない\n" +
    "一番星を宿している\n" +
    "弱いとこなんて見せちゃダメダメ\n" +
    "知りたくないとこは見せずに\n" +
    "唯一無二じゃなくちゃイヤイヤ\n" +
    "それこそ本物のアイ\n" +
    "得意の笑顔で沸かすメディア\n" +
    "隠しきるこの秘密だけは\n" +
    "愛してるって嘘で積むキャリア\n" +
    "これこそ私なりの愛だ\n" +
    "流れる汗も綺麗なアクア\n" +
    "ルビーを隠したこの瞼\n" +
    "歌い踊り舞う私はマリア\n" +
    "そう嘘はとびきりの愛だ\n" +
    "誰かに愛されたことも\n" +
    "誰かのこと愛したこともない\n" +
    "そんな私の嘘がいつか\n" +
    "本当になること信じてる\n" +
    "いつかきっと全部手に入れる\n" +
    "私はそう欲張りなアイドル\n" +
    "等身大でみんなのこと\n" +
    "ちゃんと愛したいから\n" +
    "今日も嘘をつくの\n" +
    "この言葉がいつか\n" +
    "本当になる日を願って\n" +
    "それでもまだ\n" +
    "君と君にだけは言えずにいたけど\n" +
    "やっと言えた\n" +
    "これは絶対嘘じゃない\n" +
    "愛してる\n";

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

const TypePrinter = ({texts}: { texts: string[] }) => {
    const displayText = useTypePrint(texts, 100);
    return <p>{displayText}</p>;
}

interface CaptchaData {
    verifyCodeId: string | null;
    captcha: string | null;
}


export const Captcha = () => {
    const [captcha, setCaptcha] = useState<CaptchaData | undefined>(undefined);
    const lock = useRef(false);

    const resetCaptcha = useCallback(() => {
        if (lock.current) {
            return;
        }
        lock.current = true;
        getCaptcha().then(res => {
            if (res.code === 200) {
                setCaptcha(res.data!);
            } else {
                setCaptcha({
                    verifyCodeId: null,
                    captcha: null
                });
            }
        }).finally(() => {
            lock.current = false;
        });
    }, []);
    const [_resetCaptchaCallback, _setResetCaptchaCallback] = useStore<() => unknown>('reset-captcha', resetCaptcha);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const renewCaptcha = useCallback(throttle(resetCaptcha, 1000), [resetCaptcha]);

    useEffect(() => {
        document.title = "登录";

        resetCaptcha();
    }, [resetCaptcha]);

    return (
        <div onClick={() => {
            if (captcha)
                setCaptcha(undefined);
            renewCaptcha([]);
        }}>
            <input type="hidden" name="verifyCodeId" value={captcha?.verifyCodeId ?? ""}/>
            <Image src={captcha?.captcha} alt="验证码" width={100} height={40}/>
        </div>
    );
}

export const SubmitButton = () => {
    const [showError, setShowError] = useState<string | null>(null);
    const [disable, setDisable] = useState(false);
    const nav = useNavigate();
    const [resetCaptchaCallback, _setResetCaptchaCallback] = useStore<() => unknown>('reset-captcha');

    const loginCallback = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        setDisable(true);
        const form = new FormData(e.currentTarget.form as HTMLFormElement);
        const error = validate(e.currentTarget.form as HTMLFormElement);

        if (error) {
            setShowError(error);
            setDisable(false);
            return;
        }

        const data = {
            user: (form.get("username") as string).trim(),
            password: (form.get("password") as string).trim(),
            captcha: (form.get("captcha") as string).trim(),
            verifyCodeId: (form.get("verifyCodeId") as string).trim()
        };

        return login(data).then(res => {
            setDisable(false);
            if (res.code === 200) {
                nav(-1);
            } else {
                setShowError(res.msg);
                resetCaptchaCallback();
            }
        });
    }, [nav, resetCaptchaCallback]);

    return (<>
            <div className="moe-video-login-form-error">
                {showError}
            </div>
            <div className="moe-video-login-form-btn-container">
                <Button disabled={disable} type="submit" styleType="primary" size="large"
                        onClick={loginCallback}>登录</Button>
                <div>
                    <Button styleType="link" size="medium" onClick={e => {
                        e.preventDefault();
                        showModal({
                            title: "忘记密码",
                            content: "请联系管理员重置密码",
                            closeOnClickMask: true,
                            closeIcon: false,
                        });
                    }}>忘记密码</Button>
                    <Button styleType="link" size="medium" onClick={e => {
                        e.preventDefault();
                        nav("/register");
                    }}>注册</Button>
                </div>
            </div>
        </>
    );
}

const validate = (form: HTMLFormElement) => {
    const username = form.username as HTMLInputElement;
    const password = form.password as HTMLInputElement;
    const captcha = form.captcha as HTMLInputElement;

    if (!username.checkValidity()) {
        return "邮箱格式错误";
    }
    if (!password.checkValidity()) {
        return "密码为空";
    }
    if (!captcha.checkValidity()) {
        return "验证码格式错误";
    }

    return null;
}


const Login = () => {
    const nav = useNavigate();

    useEffect(() => {
        if (isUserLoggedIn) {
            nav(-1);
        }
    }, [nav]);

    return (
        <div className="moe-video-login-root">
            <div className="moe-video-login-side">
                <TypePrinter texts={newArr}/>
            </div>
            <div className="moe-video-login-container">
                <div className="moe-video-login-form-container">
                    <h1>登 录</h1>
                    <form className="moe-video-login-form">
                        <input type="email" placeholder="邮箱" name="username" required/>
                        <input type="password" placeholder="密码" name="password" required/>
                        <div className="moe-video-login-form-captcha">
                            <input type="text" placeholder="验证码" name="captcha" required
                                   pattern={"^[a-zA-Z0-9]{4}$"}/>
                            <Captcha/>
                        </div>
                        <SubmitButton/>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;
