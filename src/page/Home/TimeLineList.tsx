import {memo, useCallback} from "react";
import './TimeLineList.less'
import {Image} from "@natsume_shiki/mika-ui";

interface TimeLineListProps {
    items: TimeLineListItem[]
}

interface TimeLineListItem {
    title: string;
    cover: string;
    playTime: string;
    score: number;
}

export const TimeLineListItem = memo((props: TimeLineListItem) => {
    const onClick = useCallback(() => {
        //跳转到播放界面
    },[]);

    return (
        <div className='moe-video-home-page-timeline-list-item relative'>
            <span className='text-xl font-medium ml-3'>{props.playTime}</span>
            <Image src={props.cover}/>
            <div className='absolute left-0 bottom-9 pt-6 px-2 w-full text-right text-2xl font-medium italic cursor-pointer'>
                <span className='text-white'>{props.score}</span>
            </div>
            <span
                className='moe-video-home-page-timeline-list-item-title pl-1 cursor-pointer'
                onClick={onClick}
            >{props.title}</span>
        </div>
    );
});

const TimeLineList = memo((props: TimeLineListProps) => {
    const {items} = props;

    return (
        <div>
            <div className='flex items-center pb-5'>
                <img className='h-11' src='/clock.png' alt=''/>
                <span className='text-3xl font-bold ml-4' style={{color: '#333'}}>新番时间表</span>
            </div>

            <div className='moe-video-home-page-timeline-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {
                    items.map((item, index) => {
                        return(<TimeLineListItem key={index} {...item}/>)
                    })
                }
            </div>
        </div>
    );
});

export default TimeLineList;