import {memo, useEffect, useState} from "react";
import './VideoPageInfo.less'
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import LikeIcon from "../Icon/LikeIcon.tsx";
import DanmakuIcon from "../Icon/DanmakuIcon.tsx";
import FavoriteIcon from "../Icon/FavoriteIcon.tsx";
import {useParams} from "react-router-dom";

export interface VideoPageInfoProps {
    title: string;
    tags: string[];
    playCount: string;
    likeCount: string;
    danmakuCount: string;
    favoriteCount: string;
    description: string;
}

const proxy_url = 'https://b.erisu.moe/api/proxy?url=';

const isTextOverflow = (element: HTMLElement | null, line: number) => {
    if (element === null) return false;
    const lineHeight = parseInt(getComputedStyle(element).lineHeight);
    return element.scrollHeight > lineHeight * line;
}

const VideoPageInfo = memo((props: VideoPageInfoProps) => {
    const [showMore, setShowMore] = useState(false);
    const [displayMoreButton, setDisplayMoreButton] = useState(false);
    const { tags, playCount, likeCount, danmakuCount, favoriteCount} = props;
    const bv = useParams().id;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setDisplayMoreButton(isTextOverflow(document.querySelector('.moe-video-video-page-description'), 5));
        });
        resizeObserver.observe(document.querySelector('.moe-video-video-page-description')!);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        fetch(proxy_url + encodeURIComponent('https://api.bilibili.com/x/web-interface/view?bvid=' + bv))
            .then(res => res.json())
            .then(res => {
                const data = res.data;
                setTitle(data.title);
                document.title = data.title + ' - Moe Video';
                setDescription(data.desc);
            });
    }, [bv]);

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
