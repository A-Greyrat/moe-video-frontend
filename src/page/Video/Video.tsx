import React, {memo, useEffect, useMemo} from "react";
import VideoPlayer, {DanmakuAttr, VideoSrc} from "mika-video-player";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import './Video.less';
import VideoPageComment from "./VideoPageComment.tsx";
import {useParams} from "react-router-dom";
import VideoPageInfo, {VideoPageInfoProps} from "./VideoPageInfo.tsx";
import VideoPaginationList from "./VideoPaginationList.tsx";
import {getDanmaku, getVideoInfo, getVideoUrl, VideoInfo} from "../../common/video";
import VideoRecommendList from "./VideoRecommendList.tsx";

const Video = memo(() => {
    const param = useParams();
    const query = useMemo(() => new URLSearchParams(window.location.search), []);
    const p = useMemo(() => query.get('p'), [query]);

    const [url, setUrl] = React.useState<string | VideoSrc | undefined>(undefined);
    const [danmakus, setDanmakus] = React.useState<DanmakuAttr[]>([]);
    const [item, setItem] = React.useState<VideoInfo>();

    useEffect(() => {
        const vid = param.id ?? 'BV1fK4y1s7Qf';
        const sess_data = query.get('SESSDATA') ?? '';

        getVideoInfo(vid).then(res => {
            setItem(res);
            const index = p ? parseInt(p) - 1 : 0;

            getVideoUrl(res.pagination[index].videoId).then(res => {
                setUrl(res);
            });

            res.extra_id && getDanmaku(res.extra_id, p, sess_data).then(res => {
                setDanmakus(res);
            });
        });
    }, [p, param.SESSDATA, param.id, query]);

    return (
        <div className="moe-video-video-page-root">
            <Header/>
            <div className="moe-video-video-page-wrapper">
                <div className='moe-video-page-video-container'>
                    <VideoPlayer src={url}
                                 danmaku={danmakus}
                                 controls
                                 style={{
                                     borderRadius: '15px',
                                     height: 'fit-content',
                                     overflow: 'hidden',
                                     width: '100%',
                                 }}
                    />

                    {item && <VideoPageInfo {...item as unknown as VideoPageInfoProps}/>}
                </div>
                {item && <VideoPageComment videoId={param.id}/>}
                {item && <VideoPaginationList items={item.pagination} activeIndex={parseInt(p || '1') - 1}/>}
                {item && <VideoRecommendList items={item.recommendList}/>}

            </div>
            <Footer/>
        </div>
    );
});

export default Video;
