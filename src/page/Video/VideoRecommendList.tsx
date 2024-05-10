import {memo} from "react";
import './VideoRecommendList.less'
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import {Image} from "@natsume_shiki/mika-ui";

export interface VideoRecommendListProps {
    items: VideoRecommendListItemProps[]
}

export interface VideoRecommendListItemProps {
    title: string,
    url: string,
    cover: string,
    playCount: string,
    update: string,
    author: string,
}


const getCover = (url: string) => {
    const host = url.split('/')[2];
    return 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pHost=' + host + '&pUrl=' + encodeURIComponent(url);
}

export const VideoRecommendListItem = memo((props: VideoRecommendListItemProps) => {
    const {url, cover, title, playCount, update, author} = props;

    return (
        <a href={url} target='_blank' className="moe-video-video-page-recommend-item">
            <div className='moe-video-video-page-recommend-list-item-cover-background'></div>
            <Image lazy src={getCover(cover)} alt={title}/>
            <div className="moe-video-video-page-recommend-item-info w-full justify-between">
                <span className='line-clamp-2 text-base'>{title}</span>
                <span className='text-gray-400'>{author}</span>
                <span className='flex justify-between'>
                    <span className='text-gray-400 flex items-center gap-1'><PlaybackVolumeIcon
                        fill='currentColor'/>{playCount}</span>
                    <span className='text-gray-400'>{update}</span>
                </span>
            </div>
        </a>
    );
});

const VideoRecommendList = memo((props: VideoRecommendListProps) => {
    const {items} = props;

    return (<div className="moe-video-video-page-recommend-wrapper">
            <p className="moe-video-video-page-recommend-title">推荐视频</p>
            <div className="moe-video-video-page-recommend-list">
                {items.map((item, index) => {
                    return (<VideoRecommendListItem key={index} {...item}/>)
                })}
            </div>
        </div>
    );
});

export default VideoRecommendList;
