import React, {memo, useEffect} from "react";
import VideoPlayer, {DanmakuAttr} from "mika-video-player";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import './Video.less';
import VideoPageComment from "./VideoPageComment.tsx";
import {useTitle} from "../../common/hooks";
import {useParams} from "react-router-dom";
import VideoPageInfo from "./VideoPageInfo.tsx";
import VideoPaginationList from "./VideoPaginationList.tsx";
import VideoRecommendList from "./VideoRecommendList.tsx";

const item = {
    title: '稲葉曇『私は雨』Vo. 歌愛ユキ / 稻叶昙 - 我是雨 (Vo. 歌爱雪)\n',
    tags: ['音乐', 'VOCALOID·UTAU', 'VOCALOID', '歌愛ユキ', '稲葉曇', 'ぬくぬくにぎりめし'],
    playCount: '68.0万',
    likeCount: '8.5万',
    danmakuCount: '1158',
    favoriteCount: '6.2万',
    recommendList: [
        {
            index: 1,
            title: '稲葉曇『私は雨』Vo. 歌愛ユキ / 稻叶昙 - 我是雨 (Vo. 歌爱雪)',
            url: '/video/1',
            cover: 'https://i1.hdslb.com/bfs/archive/3c9e5a95685493ce56ebbce4bf3d1375d016e014.jpg@320w_200h_1c_!web-space-upload-video.avif',
            playCount: '68.0万',
            update: '2021-09-10',
            author: '稲葉曇',
        },
        {
            index: 2,
            title: '稲葉曇『ラグトレイン』Vo. 歌愛ユキ / 稻叶昙- Lagtrain (Vo. 歌爱雪)',
            url: '/video/2',
            cover: 'https://i2.hdslb.com/bfs/archive/81192e9411bc18bba5f00f17736126a804610679.jpg@320w_200h_1c_!web-space-upload-video.avif',
            playCount: '57.0万',
            update: '2023-01-20',
            author: '稲葉曇',
        },
        {
            index: 3,
            title: '稲葉曇『ロストアンブレラ』Vo. 歌愛ユキ / 稻叶昙- Lost Umbrella (Vo. 歌爱雪)',
            url: '/video/3',
            cover: 'https://i1.hdslb.com/bfs/archive/b77d62d50afc8ca9bb47fb39aadfe8f8bbd2e4ca.jpg@320w_200h_1c_!web-space-upload-video.avif',
            playCount: '54.0万',
            update: '2022-03-12',
            author: '稲葉曇',
        },
        {
            index: 4,
            title: '稲葉曇『ハルノ寂寞』Vo. 弦巻マキ / 稻叶昙 - 春日寂寞 (Vo. Tsurumaki Maki)',
            url: '/video/4',
            cover: 'https://i1.hdslb.com/bfs/archive/b5045e7959337428c4bd99d2cba7c1bb7a02be67.jpg@320w_200h_1c_!web-space-upload-video.webp',
            playCount: '48.0万',
            update: '2021-11-10',
            author: '稲葉曇',
        },
        {
            index: 5,
            title: '稲葉曇『期待通り』Vo. 音街ウナ / 稻叶昙 - 期待大街 (Vo. 音街鳗)',
            url: '/video/5',
            cover: 'https://i1.hdslb.com/bfs/archive/2bd5456b9b01e02cfccd7cf8a573181afadf5778.jpg@320w_200h_1c_!web-space-upload-video.webp',
            playCount: '42.0万',
            update: '2024-03-20',
            author: '稲葉曇',
        },
        {
            index: 6,
            title: '稲葉曇『シンクタンク』Vo. 裏命 / 稻叶昙 - Sinktank (Vo. 裏命)',
            url: '/video/6',
            cover: 'https://i1.hdslb.com/bfs/archive/f2dae45e7ce81387b008351af15a878d58c05ae1.jpg@320w_200h_1c_!web-space-upload-video.webp',
            playCount: '38.0万',
            update: '2022-05-10',
            author: '稲葉曇',
        },
        {
            index: 7,
            title: '稲葉曇『フロートプレイ』Vo. 歌愛ユキ / 稻叶昙 - Float Play (Vo. 歌爱雪)\n',
            url: '/video/7',
            cover: 'https://i2.hdslb.com/bfs/archive/cbab38c3662e855b51eb519cd7e992963a85a3db.jpg@320w_200h_1c_!web-space-upload-video.webp',
            playCount: '34.0万',
            update: '2021-12-10',
            author: '稲葉曇',
        },
        {
            index: 8,
            title: '稲葉曇『レイニーブーツ』Vo. 歌愛ユキ / 稻叶昙- Rainy Boots (Vo. 歌爱雪)\n',
            url: '/video/8',
            cover: 'https://i0.hdslb.com/bfs/archive/faad7575a77d57ca6ba8be1e8492ef8be5d4f80f.jpg@320w_200h_1c_!web-space-upload-video.webp',
            playCount: '30.0万',
            update: '2022-05-02',
            author: '稲葉曇',
        },
    ],
    pagination: [
        {
            index: 'P1',
            title: '稲葉曇『私は雨』Vo. 歌愛ユキ / 稻叶昙 - 我是雨 (Vo. 歌爱雪)',
            url: '/video/1',
            duration: '04:00',
        },
        {
            index: 'P2',
            title: '稲葉曇『ラグトレイン』Vo. 歌愛ユキ / 稻叶昙- Lagtrain (Vo. 歌爱雪)',
            url: '/video/2',
            duration: '03:59',
        },
        {
            index: 'P3',
            title: '稲葉曇『ロストアンブレラ』Vo. 歌愛ユキ / 稻叶昙- Lost Umbrella (Vo. 歌爱雪)',
            url: '/video/3',
            duration: '04:00',
        },
        {
            index: 'P4',
            title: '稲葉曇『ハルノ寂寞』Vo. 弦巻マキ / 稻叶昙 - 春日寂寞 (Vo. Tsurumaki Maki)',
            url: '/video/4',
            duration: '04:00',
        },
        {
            index: 'P5',
            title: '稲葉曇『期待通り』Vo. 音街ウナ / 稻叶昙 - 期待大街 (Vo. 音街鳗)',
            url: '/video/5',
            duration: '04:00',
        },
        {
            index: 'P6',
            title: '稲葉曇『シンクタンク』Vo. 裏命 / 稻叶昙 - Sinktank (Vo. 裏命)',
            url: '/video/6',
            duration: '04:00',
        },
        {
            index: 'P7',
            title: '稲葉曇『フロートプレイ』Vo. 歌愛ユキ / 稻叶昙 - Float Play (Vo. 歌爱雪)\n',
            url: '/video/7',
            duration: '04:00',
        },
        {
            index: 'P8',
            title: '稲葉曇『レイニーブーツ』Vo. 歌愛ユキ / 稻叶昙- Rainy Boots (Vo. 歌爱雪)\n',
            url: '/video/8',
            duration: '04:00',
        },
    ],
    description: '我是稻叶昙。\n' +
        '『プロジェクトセカイ カラフルステージ！ feat. 初音ミク』\n' +
        '25時、ナイトコードで。への書き下ろし楽曲です。\n' +
        '\n' +
        '私は雨 / 25時、ナイトコードで。 × 鏡音レン\n' +
        'https://www.youtube.com/watch?v=91E_W8JhSjs\n' +
        '\n' +
        'Playlist　https://www.youtube.com/playlist?list=PLU1XqNAUBP5Vp2fOpaUV3aYa6XwfkL73f\n' +
        'Listen　coming soon\n' +
        '\n' +
        'X　https://twitter.com/inabakumori\n' +
        'Instagram　https://www.instagram.com/inabakumori/\n' +
        'Web　https://inabakumori.fanbox.cc/\n' +
        'Goods　https://inabakumori.booth.pm/\n' +
        'inst & lyrics file　https://bit.ly/2QMImD5\n' +
        '\n' +
        'Music : 稲葉曇\n' +
        'Vocal : 歌愛ユキ\n' +
        'Backing Vocal : 初音ミク\n' +
        'Illustration & Animation : ぬくぬくにぎりめし　https://twitter.com/NKNK_NGRMS\n' +
        'Movie : 稲葉曇\n' +
        '\n' +
        '------------------------------------\n' +
        '『私は雨』\n' +
        '\n' +
        '私は誰　あなたの哀れ\n' +
        '夜空の中で　名前を無くして\n' +
        'うねりのない　水面に潜む景色を\n' +
        '知らないまま　漂う雲\n' +
        '昨日までは　漂う雲\n' +
        '\n' +
        '(霧になってしまっても\n' +
        '別にいいのに　構わないのに)\n' +
        '\n' +
        '私はなぜ　真っすぐに落ちる\n' +
        'だれかの手のひらを探すため\n' +
        '空をできる限り　目に収めながら\n' +
        '\n' +
        '私は雨　弾かれて判る\n' +
        'だれかのようにはなれない雨\n' +
        '地球を困らせるほどの痛みを知らないから\n' +
        '\n' +
        '私は雨　セカイを暈す\n' +
        '夜明けに導かれている雨\n' +
        '流れ着いた海の隠し味を知るまで\n' +
        '\n' +
        '星を隠した雷鳴と\n' +
        '視界からはみ出した　積乱雲\n' +
        'できるだけ　できるだけ　できるだけ\n' +
        '離れていたかった\n' +
        '\n' +
        '傘をさす　余裕はないし\n' +
        'このままでもいいと思えるよ\n' +
        'わからないから　染み込んでるの\n' +
        '夜の強い雨で　目を覚ます\n' +
        '\n' +
        '私は雨　地球をなぞる\n' +
        '一粒では気付くことのない雨\n' +
        '夜空に飾り付ける　星を見つけて\n' +
        '\n' +
        '空に浮かんだり　地に足をつけたり\n' +
        '消えかかったり　溢れかえったりする\n' +
        '描けていたら　何も起きなかった\n' +
        'セカイ的気候変動\n' +
        '\n' +
        '私は雨　滴って判る\n' +
        'だれかのようにはなれない雨\n' +
        '地球を困らせるほどの思いを知りたいから\n' +
        '\n' +
        '私は雨　セカイを暈す\n' +
        '夜明けに導かれている雨\n' +
        '流れ着いた海の隠し味になるまで\n' +
        '\n' +
        '私は雨\n' +
        '\n' +
        '辿り着くまでに\n' +
        'おさらいを忘れないで\n' +
        '凪の海で向かい合わせ\n' +
        '違う景色　同じ模様の　答え合わせ\n' +
        '\n' +
        '------------------------------------\n' +
        'inabakumori - I\'m the Rain (Vo. Kaai Yuki)\n' +
        'BPM144',
}
const sess_data = "1443a408%2C1719124214%2Cb72e6%2Ac1CjDvyCp9vILksJqy6P2bYiAFgSgqe5SNZAZqtgODbz0Tw5PRo5uv9ZlLW5Sngurv7GMSVnpiSFE0X1pZQWE0Z2l2aHUzWFVVRzBvZm1Ma28zTmw3SDJLNkFzYWtKTkU4eHlXZlhNTDRLQl9XOTdOQ0NTZ3Y5SW41YXdaUnNZWXlwdkNzalZhU2V3IIEC";

const video_proxy_url = 'https://api.erisu.moe/proxy?pReferer=https://www.bilibili.com&pHost=';
const getUrl = (bv: string) => {
    return 'https://b.erisu.moe/api/playurl/flv?bvid=' + bv + '&SESSDATA=' + sess_data;
};

const Video = memo(() => {
    useTitle(item.title);
    const param = useParams();

    const [url, setUrl] = React.useState<string | undefined>(undefined);
    const [danmakus, setDanmakus] = React.useState<DanmakuAttr[]>([]);

    useEffect(() => {
        let bv = param.id;
        bv = bv ?? 'BV1fK4y1s7Qf';
        const c = getUrl(bv);

        fetch(c).then(res => res.json()).then(data => {
            const host = data.data.durl[0].url.split('/')[2];
            setUrl(video_proxy_url + host + '&pUrl=' + encodeURIComponent(data.data.durl[0].url));
        });

        fetch('https://b.erisu.moe/api/danmaku?bvid=' + bv + '&SESSDATA=' + sess_data).then(res => res.json()).then(data => {
            const newDanmakus: DanmakuAttr[] = [];
            for (const d of data) {
                if (d.color === 0) d.color = 0xffffff;
                newDanmakus.push({
                    begin: (parseFloat(d.progress) ?? 0) / 1000,
                    text: d.content,
                    color: '#' + parseInt(d.color).toString(16).padStart(6, '0'),
                    mode: d.mode,
                    size: d.fontsize,
                });
            }

            console.log(newDanmakus);
            setDanmakus(newDanmakus);
        });
    }, [param.id]);

    return (
        <div className="moe-video-video-page-root">
            <Header/>
            <div className="moe-video-video-page-wrapper">
                <div className="moe-video-video-page-left">
                    <VideoPlayer src={url ? url : undefined}
                                 danmaku={danmakus}
                                 controls
                                 style={{
                                     borderRadius: '15px',
                                     overflow: 'hidden',
                                     width: '100%',
                                 }}
                    />

                    <VideoPageInfo {...item}/>

                    <div className="moe-video-video-page-comment">
                        <div className="moe-video-video-page-comment-list">
                            <VideoPageComment videoId={'1'}/>
                        </div>

                    </div>

                </div>

                <div className="moe-video-video-page-right">
                    <VideoPaginationList items={item.pagination}/>

                    <VideoRecommendList items={item.recommendList}/>
                </div>
            </div>
            <Footer/>
        </div>
    );
});

export default Video;
