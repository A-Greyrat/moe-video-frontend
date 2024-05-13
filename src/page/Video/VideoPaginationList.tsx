import {memo} from "react";
import './VideoPaginationList.less'

export interface VideoPaginationListProps {
    items: VideoPaginationListItemProps[]
}

export interface VideoPaginationListItemProps {
    index: string;
    title: string;
    url: string;
    duration: string;
}

export const VideoPaginationListItem = memo((props: VideoPaginationListItemProps) => {
    return (
        <div className="moe-video-video-page-pagination-item">
            <a href={props.url}>
                <span className='mr-1.5 font-bold'>{props.index}</span>
                <span className='line-clamp-1'>{props.title}</span>
                <span className='ml-1.5 text-gray-400'>{props.duration}</span>
            </a>
        </div>
    );
});

const VideoPaginationList = memo((props: VideoPaginationListProps) => {
    const {items} = props;

    return (
        <div className="moe-video-video-page-pagination-list-wrapper">
            <p className="moe-video-video-page-pagination-title">视频列表</p>
            <div className="moe-video-video-page-pagination-list">
                {items?.length && items.map((item, index) => {
                    return (<VideoPaginationListItem key={index} {...item}/>)
                })}
            </div>
        </div>
    );
});

export default VideoPaginationList;
