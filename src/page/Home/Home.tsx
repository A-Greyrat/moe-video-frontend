import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import {useTitle} from "../../common/hooks";

import './Home.less';
import BangumiCarousel from "./BangumiCarousel.tsx";
import IndexList from "./IndexList.tsx";
import ChasingList from "./ChasingList.tsx";
import TimelineList from "./TimelineList.tsx";
import RecommendList from "./RecommendList.tsx";

const carouselItem = [{
    title: '凉宫春日的消失',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    desc: '圣诞节即将来临，SOS团火锅派对的活动拍板以后，阿虚就带着烦恼回家。第二天，阿虚如常上学，但他很快注意到，学校发生了与平日完全不同的事。应该在后面的座位的凉宫春日不在，却换上了理应让长门有希消灭了的朝仓凉子；不仅是这样，全世界也都变了……'
}, {
    title: '凉宫春日的消',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    desc: '圣诞节即将来临，SOS团火锅派对的活动拍板以后，阿虚就带着烦恼回家。第二天，阿虚如常上学，但他很快注意到，学校发生了与平日完全不同的事。应该在后面的座位的凉宫春日不在，却换上了理应让长门有希消灭了的朝仓凉子；不仅是这样，全世界也都变了……'
}, {
    title: '凉宫春日的',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    desc: '圣诞节即将来临，SOS团火锅派对的活动拍板以后，阿虚就带着烦恼回家。第二天，阿虚如常上学，但他很快注意到，学校发生了与平日完全不同的事。应该在后面的座位的凉宫春日不在，却换上了理应让长门有希消灭了的朝仓凉子；不仅是这样，全世界也都变了……'
},]

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

const chasingList = [{
    title: '凉宫春日的消失',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    watchProgress: '看到第3话 50%',
    updateProgress: '更新至第12话',
}, {
    title: '凉宫春日的消失',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    watchProgress: '看到第11话 100%',
    updateProgress: '已完结',
}, {
    title: '凉宫春日的消失',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    watchProgress: '还未观看',
    updateProgress: '更新至第12话',
},]

const timeLineList = [[{
    title: '迷宫饭',
    cover: '/img.png',
    updateTime: '18:00',
    updateTo: '更新至第12话',
    score: 9.1,
}, {
    title: '迷宫饭',
    cover: '/img.png',
    updateTime: '18:00',
    updateTo: '更新至第12话',
    score: 9.2,
}], [{
    title: '迷宫饭',
    cover: '/img.png',
    updateTime: '18:00',
    updateTo: '更新至第12话',
    score: 9.3,
}, {
    title: '迷宫饭',
    cover: '/img.png',
    updateTime: '18:00',
    updateTo: '更新至第12话',
    score: 9.4,
}], [{
    title: '迷宫饭',
    cover: '/img.png',
    updateTime: '18:00',
    updateTo: '更新至第12话',
    score: 9.5,
}], [], [
    {
        title: '迷宫饭',
        cover: '/img.png',
        updateTime: '18:00',
        updateTo: '更新至第12话',
        score: 9.6,
    }
], [], []]

const recommendList = [{
    data: {
        title: '迷宫饭',
        cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
        playbackCount: '4.6万',
        likeCount: '5.1万',
        lastUpdate: {set: 9, time: '2024-05-05'},
    },
    type: 'bangumi',
}, {
    data: {
        title: '迷宫饭1111111',
        cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
        playbackCount: '3万',
        likeCount: '6666',
        author: '免费',
        uploadTime: '2024-05-06',
    },
    type: 'video'
}, {
    data: {
        title: '迷宫饭1111111',
        cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
        playbackCount: '3万',
        likeCount: '6666',
        author: '免费',
        uploadTime: '2024-05-06',
    },
    type: 'video'
}, {
    data: {
        title: '迷宫饭1111111',
        cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
        playbackCount: '3万',
        likeCount: '6666',
        author: '免费',
        uploadTime: '2024-05-06',
    },
    type: 'video'
}, {
    data: {
        title: '迷宫饭1111111',
        cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
        playbackCount: '3万',
        likeCount: '6666',
        author: '免费',
        uploadTime: '2024-05-06',
    },
    type: 'video'
}, {
    data: {
        title: '迷宫饭1111111',
        cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
        playbackCount: '3万',
        likeCount: '6666',
        author: '免费',
        uploadTime: '2024-05-06',
    },
    type: 'video'
}]

const Home = () => {
    useTitle("首页");

    return (<div className="moe-video-home-page-root">
            <Header/>
            <div className="moe-video-home-page-wrapper">
                {/* 轮播图 */}
                <BangumiCarousel items={carouselItem}/>

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
