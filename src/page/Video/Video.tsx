import React, {memo, useEffect} from "react";
import VideoPlayer, {DanmakuAttr} from "mika-video-player";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import './Video.less';
import VideoPageComment from "./VideoPageComment.tsx";
import {useParams} from "react-router-dom";
import VideoPageInfo, {VideoPageInfoProps} from "./VideoPageInfo.tsx";
import VideoPaginationList, {VideoPaginationListItemProps} from "./VideoPaginationList.tsx";
import VideoRecommendList, {VideoRecommendListItemProps} from "./VideoRecommendList.tsx";

const video_proxy_url = 'https://api.erisu.moe/proxy?pReferer=https://www.bilibili.com&pHost=';
const getUrl = (bv: string) => {
    return 'https://b.erisu.moe/api/playurl/flv?bvid=' + bv + '&SESSDATA=';
};

interface VideoProps {
    title: string;
    tags: string[];
    playCount: number;
    likeCount: number;
    danmakuCount: number;
    favoriteCount: number;
    description: string;
    pagination: VideoPaginationListItemProps[];
    recommendList: VideoRecommendListItemProps[];
    avid: string;
}

const proxy_url = 'https://b.erisu.moe/api/proxy?x-User-Agent=Android&x-Referer=https://www.bilibili.com&x-Host=';

const getURL = (url: string) => {
    const host = url.split('/')[2];
    return proxy_url + host + '&url=' + encodeURIComponent(url);
};


const Video = memo(() => {
    // useTitle(item.title);
    const param = useParams();

    const [url, setUrl] = React.useState<string | undefined>(undefined);
    const [danmakus, setDanmakus] = React.useState<DanmakuAttr[]>([]);
    const [item, setItem] = React.useState<VideoProps>();

    useEffect(() => {
        let bv = param.id;
        bv = bv ?? 'BV1fK4y1s7Qf';
        const c = getUrl(bv);

        fetch(c).then(res => res.json()).then(data => {
            const host = data.data.durl[0].url.split('/')[2];
            setUrl(video_proxy_url + host + '&pUrl=' + encodeURIComponent(data.data.durl[0].url));
        });

        fetch('https://b.erisu.moe/api/danmaku?bvid=' + bv + '&SESSDATA=').then(res => res.json()).then(data => {
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

            setDanmakus(newDanmakus);
        });

        fetch(getURL('https://api.bilibili.com/x/web-interface/view/detail?bvid=' + bv))
            .then(res => res.json())
            .then(res => {
                const data = res.data;
                setItem({
                    title: data.View.title,
                    tags: data.Tags.map((tag: any) => tag.tag_name),
                    playCount: data.View.stat.view,
                    likeCount: data.View.stat.like,
                    danmakuCount: data.View.stat.danmaku,
                    favoriteCount: data.View.stat.favorite,
                    description: data.View.desc,
                    pagination: data.View.pages.map((page: any) => {
                        return {
                            index: 'P' + page.page,
                            title: page.part,
                            url: '/video/' + bv + '?p=' + page.page,
                            duration: new Date(page.duration * 1000).toISOString().substr(11, 8),
                        };
                    }),
                    recommendList: data.Related.map((item: any) => {
                        return {
                            title: item.title,
                            url: '/video/' + item.bvid,
                            cover: item.pic,
                            playCount: item.stat.view > 10000 ? (item.stat.view / 10000).toFixed(1) + '万' : item.stat.view,
                            update: new Date(item.pubdate * 1000).toLocaleDateString(),
                        }
                    }),
                    avid: data.View.aid,
                });
            });
    }, [param.id]);

    return (
        <div className="moe-video-video-page-root">
            <Header/>
            <div className="moe-video-video-page-wrapper">
                <VideoPlayer src={url ? url : undefined}
                             danmaku={danmakus}
                             controls
                             style={{
                                 borderRadius: '15px',
                                 height: 'fit-content',
                                 overflow: 'hidden',
                                 width: '100%',
                                 gridArea: 'video',
                             }}
                />

                {item && <VideoPageInfo {...item as unknown as VideoPageInfoProps}/>}
                {item && <VideoPageComment videoId={item.avid}/>}
                {item && <VideoPaginationList items={item.pagination}/>}
                {item && <VideoRecommendList items={item.recommendList}/>}

            </div>
            <Footer/>
        </div>
    );
});

export default Video;
