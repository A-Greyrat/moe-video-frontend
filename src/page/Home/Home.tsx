import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import {useTitle} from "../../common/hooks";

import './Home.less';
import BangumiCarousel from "./BangumiCarousel.tsx";
import IndexList from "./IndexList.tsx";
import ChasingList from "./ChasingList.tsx";
import TimelineList from "./TimelineList.tsx";
import RecommendList from "./RecommendList.tsx";
import {useEffect, useState} from "react";
import LoadingPage from "../Loading/LoadingPage.tsx";
import {getCarouselList, getRecommendList} from "../../common/video";

const indexList = [{
    title: '番剧索引',
    items: ['追番人数', '最高评分', '更新时间', '播放数量']
}, {
    title: '类型风格',
    items: ['原创', '小说改', '特摄', '漫画改', '游戏改', '布袋戏']
}, {
    title: '首播时间',
    items: ['2024', '2023', '2022', '2021', '2020', '2019']
}, {
    title: '热搜',
    items: ['迷宫饭', '我独自升级',]
},]

const proxy_url = 'https://b.erisu.moe/api/proxy?x-User-Agent=Android&x-Referer=https://www.bilibili.com&x-Host=';

const getURL = (url: string) => {
    const host = url.split('/')[2];
    return proxy_url + host + '&url=' + encodeURIComponent(url);
};

const getCover = (url: string) => {
    const host = url.split('/')[2];
    return 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pHost=' + host + '&pUrl=' + encodeURIComponent(url);
};

const convertCount = (count: number) => {
    if (count < 10000) return count;
    if (count < 100000000) return (count / 10000).toFixed(1) + '万';
    return (count / 100000000).toFixed(1) + '亿';
}

const Home = () => {
    useTitle("首页");
    const [carouselItems, setCarouselItems] = useState([]);
    const [chasingList, setChasingList] = useState([]);
    const [timeLineList, setTimeLineList] = useState([]);
    const [recommendList, setRecommendList] = useState([]);

    useEffect(() => {
        // fetch(getURL('https://api.bilibili.com/pgc/page/pc/bangumi/tab?is_refresh=0'))
        //     .then(res => res.json())
        //     .then(res => {
        //         const data = res.data.modules[1].items;
        //         setCarouselItems(data.map((item: any) => {
        //             return {
        //                 title: item.title,
        //                 cover: getCover(item.cover),
        //                 desc: item.desc,
        //             }
        //         }));
        //
        //         setChasingList(data.map((item: any) => {
        //             return {
        //                 title: item.title,
        //                 cover: getCover(item.cover),
        //                 watchProgress: '看到第' + Math.floor(Math.random() * 12) + '话 ' + Math.floor(Math.random() * 100) + '%',
        //                 updateProgress: '更新至第' + Math.floor(Math.random() * 12) + '话',
        //             }
        //         }));
        //
        //         setTimeLineList(data.map((item: any) => {
        //             return [{
        //                 title: item.title,
        //                 cover: getCover(item.cover),
        //                 updateTime: Math.floor(Math.random() * 24) + ':00',
        //                 updateTo: '更新至第' + Math.floor(Math.random() * 12) + '话',
        //                 score: ((Math.random() / 2 + 0.5) * 10).toFixed(1),
        //             }]
        //         }));
        //
        //         setRecommendList(data.map((item: any) => {
        //             return {
        //                 data: {
        //                     title: item.title,
        //                     cover: getCover(item.cover),
        //                     playbackCount:  convertCount(item.stat.view),
        //                     likeCount: convertCount(item.stat.follow),
        //                     lastUpdate: {set: item.bottom_right_badge.text, time: '2024-05-05'},
        //                 },
        //                 type: 'bangumi',
        //             }
        //         }));
        //     });

        getCarouselList().then(res => {
            setCarouselItems(res);
        });

        getRecommendList().then(res => {
            setRecommendList(res);
        });
    }, []);

    if (carouselItems.length === 0) return (<LoadingPage/>);

    return (<div className="moe-video-home-page-root">
            <Header/>
            <div className="moe-video-home-page-wrapper">
                {/* 轮播图 */}
                <BangumiCarousel items={carouselItems}/>

                {/* 索引列表 */}
                <IndexList indexList={indexList}/>

                {/* 追番列表 */}
                <ChasingList items={chasingList}/>

                {/* 时间表 */}
                <TimelineList items={timeLineList}/>

                {/* 推荐列表 */}
                <RecommendList items={recommendList}/>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
