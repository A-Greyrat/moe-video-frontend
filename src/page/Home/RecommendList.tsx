import {memo} from "react";
import './RecommendList.less'
import {Image} from "@natsume_shiki/mika-ui";
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import LoveIcon from "../Icon/LoveIcon.tsx";

interface RecommendListProps {
    items: RecommendListItemProps[]
}

export interface RecommendVideoListItemProps {
    title: string;
    cover: string;
    playbackCount: string;
    likeCount: string;
    author: string;
    uploadTime: string;
}

export interface RecommendBangumiListItemProps {
    title: string;
    cover: string;
    playbackCount: string;
    likeCount: string;
    lastUpdate: { set: number, time: string };
}

export interface RecommendListItemProps {
    data: RecommendVideoListItemProps | RecommendBangumiListItemProps;
    type?: string;
}

const RecommendBangumiListItem = memo((props: RecommendBangumiListItemProps) => {
    const {title, cover, playbackCount, likeCount, lastUpdate} = props;
    return (
        <a href='#' className='moe-video-home-page-recommend-list-item overflow-hidden'>
            <div className='relative'>
                <Image width='100%' style={{aspectRatio: '5 / 3', objectFit: 'cover'}} src={cover} lazy/>
                <div className='moe-video-home-page-recommend-list-item-cover-background'></div>
                <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light flex'>
                    <div className='flex items-center gap-1'>
                        <PlaybackVolumeIcon/>
                        <span>{playbackCount}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <LoveIcon/>
                        <span>{likeCount}</span>
                    </div>
                </div>
            </div>
            <div className='moe-video-home-page-recommend-list-item-title px-3 pt-2 pb-1'>
                {title}
            </div>
            <div className='px-3 pb-3 text-gray-400'>
                <span className='mr-2'>{lastUpdate?.set}</span>
                <span>{lastUpdate?.time}</span>
            </div>
        </a>
    );
});

const RecommendVideoListItem = memo((_props: RecommendVideoListItemProps) => {
    const {title, cover, playbackCount, likeCount, author, uploadTime} = _props;

    return (
        <a href='#' className='moe-video-home-page-recommend-list-item overflow-hidden'>
            <div className='relative'>
                <Image width='100%' style={{aspectRatio: '5 / 3', objectFit: 'cover'}} src={cover} lazy/>
                <div className='moe-video-home-page-recommend-list-item-cover-background'></div>
                <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light flex'>
                    <div className='flex items-center gap-1'>
                        <PlaybackVolumeIcon/>
                        <span>{playbackCount}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <LoveIcon/>
                        <span>{likeCount}</span>
                    </div>
                </div>
            </div>
            <div className='moe-video-home-page-recommend-list-item-title px-3 pt-2 pb-1'>
                {title}
            </div>
            <div className='px-3 pb-3 text-gray-400'>
                {author} {uploadTime}
            </div>
        </a>
    );
});

export const RecommendListItem = memo((props: RecommendListItemProps) => {
    const {type, data} = props;

    switch (type) {
        case 'video':
            return <RecommendVideoListItem {...(data as RecommendVideoListItemProps)}/>;
        case 'bangumi':
            return <RecommendBangumiListItem {...(data as RecommendBangumiListItemProps)}/>;
        default:
            throw new Error('Invalid type');
    }
});

const RecommendList = memo((props: RecommendListProps) => {
    const {items} = props;

    return (
        <>
            <div className='flex items-center pb-2'>
                <span className='text-3xl font-medium text-gray-800'>猜你喜欢</span>
            </div>

            <div className='moe-video-home-page-recommend-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {items?.length > 0 && items.map((item, index) => {
                    return <RecommendListItem key={index} {...item}/>
                })}
            </div>
        </>
    );
});

export default RecommendList;
