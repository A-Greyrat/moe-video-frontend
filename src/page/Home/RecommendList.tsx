import {memo, useCallback} from "react";
import './RecommendList.less'
import {Image} from "@natsume_shiki/mika-ui";
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";
import LoveIcon from "../Icon/LoveIcon.tsx";

interface RecommendListProps {
    items: RecommendListItemProps[]
}

interface RecommendListItemProps {
    title: string;
    cover: string;
    playbackCount: string;
    likeCount: string;
    offer?: string;
    uploadTime?: string;
    lastUpdate?: {set: number, time: string};
}

export const RecommendListItem = memo((props: RecommendListItemProps) => {
    const onClick = useCallback(() => {
        //跳转到播放页面
    },[])

    return (
        <div className='moe-video-home-page-recommend-list-item relative'>
            <Image src={props.cover}/>
            <div className='absolute left-0 bottom-12 pt-6 px-2 w-full flex items-center cursor-pointer'>
                <PlaybackVolumeIcon/>
                <span className='text-white text-sm pl-1 pr-2'>{props.playbackCount}</span>
                <LoveIcon/>
                <span className='text-white'>{props.likeCount}</span>
            </div>
            <span
                className={'text-base font-bold text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer pl-2'}
                onClick={onClick}
            >{props.title}</span>
            <div className='moe-video-home-page-recommend-list-item-info pl-2'>
                {
                    props?.offer && <span className='pr-1'>{props?.offer}</span>
                }
                {
                    props?.uploadTime && <span>{props?.uploadTime}</span>
                }
                {
                    props?.lastUpdate && <span>{'更新至第' + props?.lastUpdate?.set + '话 ' + props?.lastUpdate?.time}</span>
                }
            </div>
        </div>
    );
});

const RecommendList = memo((props: RecommendListProps) => {
    const {items} = props;
    return (
        <div>
            <div className='flex items-center pb-5'>
                <span className='text-3xl font-bold' style={{color: '#333'}}>猜你喜欢</span>
            </div>

            <div className='moe-video-home-page-recommend-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {
                    items.map((item, index) => {
                        return <RecommendListItem key={index} {...item}/>
                    })
                }
            </div>
        </div>
    );
});

export default RecommendList;