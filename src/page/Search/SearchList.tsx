import {memo} from "react";
import './SearchList.less';
import {Button, Image} from "@natsume_shiki/mika-ui";
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import LoveIcon from "../Icon/LoveIcon.tsx";

export interface BangumiItemProps {
    title: string;
    cover: string;
    score: string;
    desc: string;
    tags: string[];
}

export interface VideoItemProps {
    title: string;
    cover: string;
    playCount: string;
    likeCount: string;
    author: string;
    uploadTime: string;
}

interface SearchListProps {
    bangumiList: BangumiItemProps[];
    videoList: VideoItemProps[];
}

export const BangumiItem = memo((props: BangumiItemProps) => {
    const {title, cover, score, desc, tags} = props;

    return (
        <div className='moe-video-search-page-bangumi-list-item flex py-2 px-2'>
            <a href='#'
               className='moe-video-search-page-bangumi-list-item-cover overflow-hidden mr-4'>
                <div className='relative w-full h-full'>
                    <Image width='100%' className='moe-video-search-page-bangumi-list-item-cover-img' style={{aspectRatio: '3 / 4'}} src={cover} lazy/>
                    <div
                        className='absolute left-0 bottom-2 pt-6 px-2 w-full text-right text-2xl font-medium italic'>
                        <span className='text-white'>{score}</span>
                    </div>
                </div>
            </a>
            <div className='flex flex-col justify-between overflow-hidden'>
                <div>
                    <div
                        className='moe-video-search-page-bangumi-list-item-title pb-2'>{title}</div>
                    <div className='flex gap-1 flex-wrap h-7 overflow-hidden'>
                        {tags.length > 0 && tags.map((tag, index) => {
                            return (
                                <div key={index}
                                     className='moe-video-search-page-bangumi-list-item-tag'
                                >
                                    {tag}
                                </div>
                            )
                        })}
                    </div>
                    <div
                        className='text-sm text-gray-500 line-clamp-4 whitespace-break-spaces my-2'>
                        {desc}
                    </div>
                </div>

                <div className='flex gap-2'>
                    <Button
                        size='large'
                        styleType='primary'
                        style={{
                            width: 'fit-content',
                            fontSize: '1rem'
                        }}
                    >立即观看</Button>
                    <Button
                        size='large'
                        styleType='default'
                        style={{
                            fontSize: '1rem',
                            width: 'fit-content'
                        }}
                    >加入追番</Button>
                </div>
            </div>
        </div>
    );
});

export const VideoItem = memo((props: VideoItemProps) => {
    const {title, cover, playCount, likeCount, author, uploadTime} = props;

    return (
        <a href='#'
           className='moe-video-search-page-video-list-item overflow-hidden'>
            <div className='relative'>
                <Image width='100%' style={{aspectRatio: '5 / 3', objectFit: 'cover'}}
                       src={cover} lazy/>
                <div className='moe-video-search-page-video-list-item-cover-background'></div>
                <div
                    className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light flex'>
                    <div className='flex items-center gap-1'>
                        <PlaybackVolumeIcon/>
                        <span>{playCount}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <LoveIcon/>
                        <span>{likeCount}</span>
                    </div>
                </div>
            </div>
            <div className='moe-video-search-page-video-list-item-title px-3 pt-2 pb-1'>
                {title}
            </div>
            <div className='px-3 pb-3 text-gray-400'>
                {author} {uploadTime}
            </div>
        </a>
    );
});

const SearchList = memo((props: SearchListProps) => {
    const {bangumiList, videoList} = props;

    return (
        <div>
            <div className='moe-video-search-page-bangumi-list mb-12 gap-4 w-full'>
                {bangumiList.length > 0 && bangumiList.map((item, index) => {
                    return (<BangumiItem key={index} {...item}/>)
                })}
            </div>
            <div className='moe-video-search-page-video-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {videoList.length > 0 && videoList.map((item, index) => {
                    return (<VideoItem key={index} {...item}/>)
                })}
            </div>
        </div>
    )
});

export default SearchList;