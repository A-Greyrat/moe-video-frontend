import {memo, useCallback} from "react";

import './ChasingList.less'
import {Image} from "@natsume_shiki/mika-ui";
import PlaybackVolumeIcon from "../Icon/PlaybackVolumeIcon.tsx";

interface ChasingListItem {
    title: string;
    cover: string;
    playbackVolume: string;
}

interface ChasingListProps {
    items: ChasingListItem[]
}

export const ChasingListItem = memo((props: ChasingListItem) => {
    const onClick = useCallback(() => {
        //跳转到播放页面
    },[]);

    return(
        <div className={'moe-video-home-page-chasing-list-item relative'}>
            <Image src={props.cover}/>
            <div className='absolute left-0 bottom-10 pt-6 px-2 w-full flex items-center gap-1 cursor-pointer'>
                <PlaybackVolumeIcon/>
                <span className={'text-white text-sm'}>{props.playbackVolume}</span>
            </div>
            <span
                className={'moe-video-home-page-chasing-list-item-title mb-2 pl-1'}
                onClick={onClick}
            >{props.title}</span>
        </div>
    );
});

const ChasingList = memo((props: ChasingListProps) => {
    const {items} = props;

    return (
        <div className={'moe-video-home-page-chasing-list-wrapper'}>
        <div className='flex items-center pb-5'>
                <img className='h-11' src='/chasing.png' alt=''/>
                <span className='text-3xl font-bold ml-4' style={{color: '#333'}}>我的追番</span>
            </div>

            <div className='moe-video-home-page-chasing-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {
                    items.map((item, index) => {
                        return <ChasingListItem key={index} {...item}/>
                    })
                }
            </div>
        </div>
    );
});

export default ChasingList;