import {memo} from "react";
import './HistoryList.less';
import {Button, Image} from "@natsume_shiki/mika-ui";

export interface HistoryListProps {
    historyList: HistoryListItemProps[];
}

export interface HistoryListItemProps {
    type: 'video' | 'bangumi';
    title: string;
    cover: string;
    videoTitle: string;
    lastWatchedTime: string;
    index: number;
    url: string;
}

export const HistoryListItem = memo((props: HistoryListItemProps) => {
    const {type, title, cover, lastWatchedTime, index, videoTitle, url} = props;

    return (
        <>
            <div
                className='moe-video-space-page-history-list-item flex w-full'
            >
                <a href={url}
                   className='moe-video-space-page-history-list-item-cover mr-5 overflow-hidden'>
                    <Image lazy width='100%' style={{aspectRatio: '5 / 3', objectFit: 'cover'}}
                           src={cover}/>
                </a>
                <div className='flex justify-between flex-auto'>
                    <div className='flex flex-col justify-between mr-4'>
                        <div className={'flex flex-col gap-1'}>
                            <a href={url}
                               className='moe-video-space-page-history-list-item-title line-clamp-1'>{title}</a>
                            <div className='text-gray-400'>{lastWatchedTime}</div>
                        </div>
                        {
                            type === 'bangumi' &&
                            <div
                                className='text-gray-400 line-clamp-1'>看到第{index}集 {videoTitle}</div>
                        }
                    </div>
                    <div className='flex self-center'>
                        <Button
                            size='large'
                            styleType='default'
                            style={{
                                width: 'fit-content',
                                height: 'fit-content',
                                fontSize: '1rem'
                            }}
                        >删除</Button>
                    </div>
                </div>
            </div>
            <hr className='mt-2 border-gray-200 '/>
        </>
    );
});

const HistoryList = memo((props: HistoryListProps) => {
    const {historyList} = props;

    return (
        <div>
            {historyList.length > 0 &&
                <div className='moe-video-space-page-history-list flex flex-col gap-4'>
                    {historyList.map((item, index) => {
                        return (<HistoryListItem key={index} {...item}/>);
                    })}
                </div>
            }
        </div>
    );
});

export default HistoryList;