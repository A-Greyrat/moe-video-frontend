import {memo} from "react";
import './VideoRecommendList.less'
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";

interface VideoRecommendListProps {
    items: VideoRecommendListItemProps[]
}

interface VideoRecommendListItemProps {
    index: number,
    title: string,
    url: string,
    cover: string,
    playCount: string,
    update: string,
    author: string,
}

const proxy_url = 'https://api.erisu.moe/proxy?pReferer=https://www.bilibili.com&pHost=';

const getURL = (url: string) => {
    const host = url.split('/')[2];
    return proxy_url + host + '&pUrl=' + encodeURIComponent(url);
};

export const VideoRecommendListItem = memo((props: VideoRecommendListItemProps) => {
    return (
        <a href={props.url} className="moe-video-video-page-recommend-item">
            <img src={getURL(props.cover)} alt={props.title}/>
            <div className="moe-video-video-page-recommend-item-info">
                <span className='line-clamp-2 text-base'>{props.title}</span>
                <span className='text-gray-400'>{props.author}</span>
                <span className='flex justify-between'>
                    <span className='text-gray-400 flex items-center gap-1'><PlaybackVolumeIcon fill='currentColor'/>{props.playCount}</span>
                    <span className='text-gray-400'>{props.update}</span>
                </span>
            </div>
        </a>
    );
});

const VideoRecommendList = memo((props: VideoRecommendListProps) => {
    const {items} = props;

    return (
        <div className="moe-video-video-page-recommend-list">
            <p className="moe-video-video-page-recommend-title">推荐视频</p>
            {items.map((item, index) => {
                return (<VideoRecommendListItem key={index} {...item}/>)
            })}
        </div>
    );
});

export default VideoRecommendList;