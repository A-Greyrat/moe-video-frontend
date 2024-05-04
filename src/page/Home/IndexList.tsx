import {memo} from "react";

import './IndexList.less';

interface IndexListProps {
    indexList: IndexListItemProps[]
}

interface IndexListItemProps {
    title: string
    items: string[]
}

export const IndexListItem = memo((props: IndexListItemProps) => {
    const {items} = props;

    return (
        <div className={'moe-video-home-page-index-item-wrapper'}>
            <div className='moe-video-home-page-index-item-title cursor-pointer'>
                {props.title}
            </div>
            <div className='moe-video-home-page-index-item-list'>
                {items.map((item, index) => {
                    return (<div className='moe-video-home-page-index-item'>
                        <a href='#' key={index}>{item}</a>
                    </div>);
                })}
            </div>
        </div>
    );
});

const IndexList = memo((props: IndexListProps) => {
    const {indexList} = props;

    return (
        <div className='moe-video-home-page-index-wrapper flex gap-4 my-12'>
            {indexList.map((item, index) => {
                return <IndexListItem key={index} title={item.title} items={item.items}/>
            })}
        </div>
    );
});

export default IndexList;
