import {memo, useState} from "react";
import './TimelineList.less'
import {Image, TabList} from "@natsume_shiki/mika-ui";

interface TimelineListProps {
    items: TimelineListItem[][]
}

interface TimelineListItem {
    title: string;
    cover: string;
    updateTime: string;
    updateTo: string;
    score: number;
}

export const TimelineListItem = memo((props: TimelineListItem) => {
    const {title, cover, updateTime, updateTo, score} = props;
    return (
        <a href='#' className='moe-video-home-page-timeline-list-item overflow-hidden max-w-52'>
            <div className='relative'>
                <Image width='100%' style={{aspectRatio: '3 / 4'}} src={cover} lazy/>
                <div className='absolute left-0 bottom-2 pt-6 px-2 w-full text-right text-2xl font-medium italic cursor-pointer'>
                    <span className='text-white'>
                        {score}
                    </span>
                </div>
            </div>
            <div className='moe-video-home-page-timeline-list-item-title px-3 pt-2 pb-1'>
                {title}
            </div>
            <div className='px-3 pb-3 text-gray-400'>
                {updateTime} {updateTo}
            </div>
        </a>
    );
});

const TimelineList = memo((props: TimelineListProps) => {
    const {items} = props;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <div className='flex items-center pb-2'>
                <img className='h-11' src='/clock.png' alt=''/>
                <span className='text-3xl font-medium ml-2 text-gray-800'>新番时间表</span>
            </div>

            <TabList items={['周一', '周二', '周三', '周四', '周五', '周六', '周日']}
                     activeIndex={activeIndex}
                     onChange={setActiveIndex}
                     style={{
                         justifyContent: 'space-between',
                         padding: '0.2rem 1rem',
                         marginBottom: '1rem',
                         marginTop: '0.5rem'
                     }}
                     className='moe-video-home-page-timeline-list-tab'
            />

            <div className='moe-video-home-page-timeline-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {items?.length > 0 && items[activeIndex].map((item, index) => {
                    return (<TimelineListItem key={index} {...item}/>)
                })}
            </div>
        </>
    );
});

export default TimelineList;
