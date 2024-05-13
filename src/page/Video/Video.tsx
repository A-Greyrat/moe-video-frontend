import React, {memo, useEffect} from "react";
import VideoPlayer, {DanmakuAttr} from "mika-video-player";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import './Video.less';
import VideoPageComment from "./VideoPageComment.tsx";
import {useParams} from "react-router-dom";
import VideoPageInfo, {VideoPageInfoProps} from "./VideoPageInfo.tsx";
import VideoPaginationList from "./VideoPaginationList.tsx";
import {getDanmaku, getVideoInfo, getVideoURL, VideoInfo} from "../../common/video";
import VideoRecommendList from "./VideoRecommendList.tsx";

const Video = memo(() => {
    const param = useParams();

    const [url, setUrl] = React.useState<string | undefined>(undefined);
    const [danmakus, setDanmakus] = React.useState<DanmakuAttr[]>([]);
    const [item, setItem] = React.useState<VideoInfo>();

    useEffect(() => {
        const bv = param.id ?? 'BV1fK4y1s7Qf';
        const query = new URLSearchParams(window.location.search);
        const p = query.get('p');
        const sess_data = query.get('SESSDATA') ?? '';

        getVideoURL(bv, p, sess_data).then(res => {
            setUrl(res);
        });

        getDanmaku(bv, p, sess_data).then(res => {
            setDanmakus(res);
        });

        getVideoInfo(bv).then(res => {
            setItem(res);
        });
    }, [param.SESSDATA, param.id, param.p]);

    return (
        <div className="moe-video-video-page-root">
            <Header/>
            <div className="moe-video-video-page-wrapper">
                <div className='moe-video-page-video-container'>
                    <VideoPlayer src={url ? url : undefined}
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
                {item && <VideoPageComment videoId={item.avid}/>}
                {item && <VideoPaginationList items={item.pagination}/>}
                {item && <VideoRecommendList items={item.recommendList}/>}

            </div>
            <Footer/>
        </div>
    );
});

export default Video;
