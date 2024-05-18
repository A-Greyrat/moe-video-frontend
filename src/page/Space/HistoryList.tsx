import { memo, useEffect, useRef, useState } from 'react';
import './HistoryList.less';
import { Button, Image, InfinityList } from '@natsume_shiki/mika-ui';
import { getHistoryList } from '../../common/video';

export interface HistoryListItemProps {
  type: 'video' | 'bangumi';
  title: string;
  cover: string;
  videoTitle: string;
  lastWatchedTime: string;
  index: number;
  url: string;
}

export interface HistoryListProps {
  historyList: HistoryListItemProps[];
}

export const HistoryListItem = memo((props: HistoryListItemProps) => {
  const { type, title, cover, lastWatchedTime, index, videoTitle, url } = props;

  return (
    <>
      <div className='moe-video-space-page-history-list-item flex w-full'>
        <a href={url} className='moe-video-space-page-history-list-item-cover mr-5 overflow-hidden'>
          <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        </a>
        <div className='flex justify-between flex-auto'>
          <div className='flex flex-col justify-between mr-4'>
            <div className={'flex flex-col gap-1'}>
              <a href={url} className='moe-video-space-page-history-list-item-title line-clamp-1'>
                {title}
              </a>
              <div className='text-gray-400'>{lastWatchedTime}</div>
            </div>
            {type === 'bangumi' && (
              <div className='text-gray-400 line-clamp-1'>
                看到第{index}集 {videoTitle}
              </div>
            )}
          </div>
          <div className='flex self-center'>
            <Button
              size='large'
              styleType='default'
              style={{
                width: 'fit-content',
                height: 'fit-content',
                fontSize: '1rem',
              }}
            >
              删除
            </Button>
          </div>
        </div>
      </div>
      <hr className='mt-2 border-gray-200 ' />
    </>
  );
});

const HistoryList = memo(() => {
  const [historyList, setHistoryList] = useState<HistoryListItemProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useRef(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getHistoryList(currentPage, pageSize.current).then((res) => {
      setHistoryList(res.items);
      setTotal(res.total);
    });
  }, []);

  if (total === 0) {
    return (
      <div className='moe-video-space-page-history-list flex flex-col gap-4'>
        <div className='text-center text-gray-400'>暂无历史记录</div>
      </div>
    );
  }

  return (
    <InfinityList
      onIntersect={async (unloading) => {
        getHistoryList(currentPage, pageSize.current).then((res) => {
          setHistoryList([...historyList, ...res.items]);
          setCurrentPage(currentPage + 1);
          unloading();
        });
      }}
      limit={total}
      itemNum={historyList.length}
    >
      {historyList.length > 0 && (
        <div className='moe-video-space-page-history-list flex flex-col gap-4'>
          {historyList.map((item, index) => (
            <HistoryListItem key={index} {...item} />
          ))}
        </div>
      )}
    </InfinityList>
  );
});

export default HistoryList;
