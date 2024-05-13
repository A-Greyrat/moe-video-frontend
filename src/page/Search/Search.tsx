import {memo, useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "../../component/header/Header.tsx";
import {TabList, Pagination} from "@natsume_shiki/mika-ui";
import './Search.less';
import Footer from "../../component/footer/Footer.tsx";
import SearchList, {BangumiItemProps, VideoItemProps} from "./SearchList.tsx";
import {httpGet} from "../../common/axios";

// import SearchTypeTabList from "./SearchTypeTabList.tsx";

export interface SearchItemProps {
    title: string;
    playCount: number;
    likeCount: number;
    cover: string;
    score?: string;
    desc?: string;
    tags?: string[];
    author?: string;
    uploadTime?: string;
}

const bangumiList1 = [
    {
        title: '迷宫饭',
        cover: '/img.png',
        score: '9.6',
        desc: '迷宫饭。是“吃”，还是“被吃”，这是一个问题。在迷宫深处，莱欧斯眼看着红龙吃掉了妹妹，自己在将死之际回到了地面。尽管他想要马上再次挑战迷宫，但是钱和粮食都被留在了最深处。面对妹妹可能会被消化掉的危机，莱欧斯下定了决心。“食物就在迷宫中自给自足吧！”史莱姆，蛇尾鸡，宝箱怪，还有龙！吃着来袭的魔物们，打通迷宫吧，冒险者！',
        tags: ['搞笑', '漫画改', '美食', '美食', '漫画改', '漫画改']
    },
    {
        title: '迷宫饭',
        cover: '/img.png',
        score: '9.6',
        desc: '迷宫饭。是“吃”，还是“被吃”，这是一个问题。在迷宫深处，莱欧斯眼看着红龙吃掉了妹妹，自己在将死之际回到了地面。尽管他想要马上再次挑战迷宫，但是钱和粮食都被留在了最深处。面对妹妹可能会被消化掉的危机，莱欧斯下定了决心。“食物就在迷宫中自给自足吧！”史莱姆，蛇尾鸡，宝箱怪，还有龙！吃着来袭的魔物们，',
        tags: ['搞笑', '漫画改', '美食']
    },
    {
        title: '迷宫饭',
        cover: '/img.png',
        score: '9.6',
        desc: '迷宫饭。是“吃”，还是“被吃”，这是一个问题。在迷宫深处，莱欧斯眼看着红龙吃掉了妹妹，自己在将死之际回到了地面。尽管他想要马上再次挑战迷宫，但是钱和粮食都被留在了最深处。面对妹妹可能会被消化掉的危机，莱欧斯下定了决心。“食物就在迷宫中自给自足吧！”史莱姆，蛇尾鸡，宝箱怪，还有龙！吃着来袭的魔物们，',
        tags: ['搞笑', '漫画改', '美食']
    }
]

const videoList1 = [{
    title: '我独自升级',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我独自升级',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我独自升级',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我独自升级',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我独自升级',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我独自升级',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}]

const videoList2 = [{
    title: '我',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}, {
    title: '我',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    likeCount: '5.2万',
    author: '纳豆',
    uploadTime: '2024-5-10'
}]

const Search = memo(() => {
    const {id, page} = useParams();
    const [items, setItems] = useState<SearchItemProps[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [bangumiList, setBangumiList] = useState<BangumiItemProps[]>([]);
    const [videoList, setVideoList] = useState<VideoItemProps[]>([]);
    const [pageInfo, setPageInfo] = useState({
        total: 6,
        currentPage: 1,
        pageSize: 3,
    });

    useEffect(() => {
        // fetch(`/api/search/${id}/${page}`).then(res => {
        //     console.log(res);
        // });
        // httpGet(`/search?q=${id}&page=${page}&pageSize=${pageInfo.pageSize}`).then(res => {
        //     console.log(res.data)
        // })

        if (activeIndex === 0) {
            if (pageInfo.currentPage === 1) {
                setBangumiList(bangumiList1);
                setVideoList(videoList1);
            } else {
                setBangumiList([]);
                setVideoList(videoList2);
            }
        } else if (activeIndex === 1) {
            setBangumiList([]);
            if (pageInfo.currentPage === 1) {
                setVideoList(videoList1);
            } else {
                setVideoList(videoList2);
            }
        } else if (activeIndex === 2) {
            setBangumiList(bangumiList1);
            setVideoList([]);
        }
    }, [activeIndex, pageInfo]);

    const handlePageInfo = useCallback((key: string, newInfo: any) => {
        const newPageInfo = {...pageInfo};
        newPageInfo[key] = newInfo;
        setPageInfo(newPageInfo);
    }, [pageInfo]);

    return (
        <div>
            <Header/>
            <div className='moe-video-search-page-wrapper'>
                {/*<SearchTypeTabList searchType={[ '综合', '视频', '番剧']} activeIndex={activeIndex} />*/}
                <TabList items={['综合', '视频', '番剧']}
                         activeIndex={activeIndex}
                         onChange={(index) => {
                             setActiveIndex(index);
                             handlePageInfo('currentPage', 1);
                         }}
                         className='moe-video-search-page-list-tab'
                         style={{
                             marginBottom: '1rem',
                             padding: '0.2rem 1rem',
                             justifyContent: 'space-between',
                         }}
                />

                {/*搜索列表*/}
                <SearchList bangumiList={bangumiList} videoList={videoList}/>

                {
                    activeIndex !== 2 && <Pagination
                        key={activeIndex}
                        pageNum={Math.ceil(pageInfo.total / pageInfo.pageSize)}
                        onChange={(index) => {
                            handlePageInfo('currentPage', index);
                            setBangumiList([]);
                            setVideoList([]);
                        }}
                        style={{
                            width: 'fit-content',
                            margin: '1rem auto',
                        }}
                    />
                }

            </div>
            <Footer/>

        </div>
    );
});

export default Search;
