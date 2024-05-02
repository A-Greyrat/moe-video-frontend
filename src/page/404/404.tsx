import './404.less';
import {useTitle, useTypePrint} from "../../common/hooks";

const text = [
    "什么都没有",
    "你要找的东西不在这里",
    "犹如此处只有虚无",
    "Vanitas vanitatum, omnia vanitas.",
    "全ては虚無、虚無の中に",
    "404は一体何なのか",
    "それは私たちにとっての終わり",
    "404 Not Found.",
    "The requested URL was not found on this server.",
    "That's all we know.",
];

const $404 = () => {
    const display = useTypePrint(text, 50);
    useTitle("404");

    return (
        <div className="moe-video-404-root">
            <h1>{display}</h1>
        </div>
    )
}

export default $404;
