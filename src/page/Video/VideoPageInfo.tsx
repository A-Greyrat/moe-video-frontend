import {memo, useState} from "react";
import './VideoPageInfo.less'
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import LikeIcon from "../Icon/LikeIcon.tsx";
import DanmakuIcon from "../Icon/DanmakuIcon.tsx";
import FavoriteIcon from "../Icon/FavoriteIcon.tsx";

interface VideoPageInfoProps {
    title: string;
    tags: string[];
    playCount: string;
    likeCount: string;
    danmakuCount: string;
    favoriteCount: string;
    description: string;
}

const VideoPageInfo = memo((props: VideoPageInfoProps) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className='moe-video-video-page-info'>
            <h1 className='moe-video-video-page-title'>
                {props.title}
            </h1>
            <span className='moe-video-video-page-tags'>
                            {props.tags.map((tag, index) => {
                                return <span key={index} className='moe-video-video-page-tag'>{tag}</span>
                            })}
                        </span>

            <div className='moe-video-video-page-count'>
                <span><PlaybackVolumeIcon/>{props.playCount}</span>
                <span><LikeIcon/>{props.likeCount}</span>
                <span><DanmakuIcon/>{props.danmakuCount}</span>
                <span><FavoriteIcon/>{props.favoriteCount}</span>
            </div>

            <div className={'moe-video-video-page-description ' + (showMore ? '' : 'line-clamp-5')}>
                <p>{props.description}</p>
            </div>
            <p className="moe-video-video-page-show-more" onClick={() => setShowMore(!showMore)}>
                {showMore ? '收起' : '展开'}
            </p>

        </div>
    );
});

export default VideoPageInfo;