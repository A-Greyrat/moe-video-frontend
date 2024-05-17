import {memo, useEffect, useState} from "react";
import './VideoPageInfo.less'
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import LikeIcon from "../Icon/LikeIcon.tsx";
import DanmakuIcon from "../Icon/DanmakuIcon.tsx";
import FavoriteIcon from "../Icon/FavoriteIcon.tsx";
import {useParams} from "react-router-dom";
import {useTitle} from "../../common/hooks";
import ReportIcon from "../Icon/ReportIcon.tsx";

export interface VideoPageInfoProps {
    title: string;
    tags: string[];
    playCount: string;
    likeCount: string;
    danmakuCount: string;
    favoriteCount: string;
    description: string;
}

const isTextOverflow = (element: HTMLElement | null, line: number) => {
    if (element === null) return false;
    const lineHeight = parseInt(getComputedStyle(element).lineHeight);
    return element.scrollHeight > lineHeight * line;
}

const VideoPageInfo = memo((props: VideoPageInfoProps) => {
    const { tags, playCount, likeCount, danmakuCount, favoriteCount, title, description} = props;

    useTitle(props.title);
    const [showMore, setShowMore] = useState(false);
    const [displayMoreButton, setDisplayMoreButton] = useState(false);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setDisplayMoreButton(isTextOverflow(document.querySelector('.moe-video-video-page-description'), 5));
        });
        resizeObserver.observe(document.querySelector('.moe-video-video-page-description')!);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className='moe-video-video-page-info'>
            <h1 className='moe-video-video-page-title'>
                {title}
            </h1>

            <div className='moe-video-video-page-count'>
                <span><PlaybackVolumeIcon/>{playCount}</span>
                <span><LikeIcon/>{likeCount}</span>
                <span><DanmakuIcon/>{danmakuCount}</span>
                <span><FavoriteIcon/>{favoriteCount}</span>
                <span><ReportIcon/></span>
            </div>

            <div className={'moe-video-video-page-description ' + (showMore ? '' : 'line-clamp-5')}>
                <p>{description}</p>
            </div>
            <p className="moe-video-video-page-show-more"
               style={{display: displayMoreButton ? 'block' : 'none'}}
               onClick={() => setShowMore(!showMore)}>
                {showMore ? '收起' : '展开'}
            </p>

            <span className='moe-video-video-page-tags'>
                {tags?.length > 0 && tags.map((tag, index) => {
                    return <span key={index} className='moe-video-video-page-tag'>{tag}</span>
                })}
            </span>
        </div>
    );
});

export default VideoPageInfo;
