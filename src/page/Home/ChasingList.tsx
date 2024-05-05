import {memo} from "react";

import './ChasingList.less'
import {Image} from "@natsume_shiki/mika-ui";

interface ChasingListItem {
    title: string;
    cover: string;
    playbackCount: string;
}

interface ChasingListProps {
    items: ChasingListItem[]
}

export const ChasingListItem = memo((props: ChasingListItem) => {
    const {title, cover} = props;

    return (
        <a href='#' className='moe-video-home-page-chasing-list-item relative overflow-hidden'>
            <div className='relative'>
                <Image src={cover} lazy/>
                <div className='moe-video-home-page-chasing-list-item-cover-background'></div>
                <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light'>
                    看到第三话 50%
                </div>
            </div>
            <div className='moe-video-home-page-chasing-list-item-title px-3 pt-2 pb-1'>
                {title}
            </div>
            <div className='moe-video-home-page-chasing-list-item-last-update px-3 pb-3 text-gray-400'>
                更新至第12话
            </div>
        </a>
    );
});

const ChasingList = memo((props: ChasingListProps) => {
    const {items} = props;

    return (
        <div className={'moe-video-home-page-chasing-list-wrapper'}>
            <div className='flex items-center pb-2'>
                <img className='h-11' src='/chasing.png' alt=''/>
                <span className='text-3xl font-medium ml-2 text-gray-800'>我的追番</span>
            </div>

            <div className='moe-video-home-page-chasing-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                {items.map((item, index) => {
                    return <ChasingListItem key={index} {...item}/>
                })}
            </div>
        </div>
    );
});

export default ChasingList;
