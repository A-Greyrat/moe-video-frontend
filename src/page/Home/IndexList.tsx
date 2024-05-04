import {memo, useCallback} from "react";

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

    const onClick = useCallback(() => {
        //点击跳转至搜索界面
    },[])

    return (
        <div className={'moe-video-home-page-index-item-wrapper'}>
            <div className='moe-video-home-page-index-item-title font-bold cursor-pointer' onClick={onClick}>{props.title}</div>
            <div className={'moe-video-home-page-index-item-list flex flex-wrap'}>
                {
                    items.map((item, index) => {
                        return <div
                            key={index}
                            className='moe-video-home-page-index-item cursor-pointer'
                            onClick={onClick}
                        >{item}</div>
                    })
                }
            </div>
        </div>
    );
});

const IndexList = memo((props: IndexListProps) => {
    const {indexList} = props;

    return (
        <div className='moe-video-home-page-index-wrapper flex gap-4 my-12'>
            {
                indexList.map((item, index) => {
                    return <IndexListItem key={index} title={item.title} items={item.items}/>
                })
            }
        </div>
    );
});

export default IndexList;