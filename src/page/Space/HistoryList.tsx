import { memo, useEffect, useRef } from 'react';
import './HistoryList.less';
import { Button, Image, InfinityList, showMessage } from '@natsume_shiki/mika-ui';
import { deleteHistory, getHistoryList } from '../../common/video';
import { useTitle } from '../../common/hooks';
import { useStore } from 'mika-store';
import SkeletonCard from '../../component/SkeletonCard';

export interface HistoryListItemProps {
  type: 'video' | 'bangumi';
  videoGroupId: string;
  title: string;
  cover: string;
  videoTitle: string;
  lastWatchedTime: string;
  index: number;
  author: string;
  url: string;
}

export const HistoryListItem = memo((props: HistoryListItemProps) => {
  const { type, videoGroupId, title, cover, lastWatchedTime, index, author, videoTitle, url } = props;
  const [historyList, setHistoryList] = useStore<HistoryListItemProps[]>('moe-video-history-list', []);
  const [total, setTotal] = useStore('moe-video-history-list-total', 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentPage, setCurrentPage] = useStore('moe-video-history-list-current-page', 1);

  return (
    <>
      <div className='moe-video-space-page-history-list-item flex w-full'>
        <a href={`${url}?p=${index}`} className='moe-video-space-page-history-list-item-cover mr-5 overflow-hidden'>
          <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        </a>
        <div className='flex justify-between flex-auto'>
          <div className='flex flex-col justify-between mr-4'>
            <div className={'flex flex-col gap-1'}>
              <a href={`${url}?p=${index}`} className='moe-video-space-page-history-list-item-title line-clamp-1'>
                {videoGroupId ? title : '视频不存在'}
              </a>
              <div className='text-gray-400 line-clamp-1'>{lastWatchedTime}</div>
            </div>
            {type === 'bangumi' && (
              <div className='text-base text-gray-400 line-clamp-1'>
                看到第{index}集 {videoTitle}
              </div>
            )}
            {type === 'video' && <div className='text-gray-400 line-clamp-1'>{author}</div>}
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
              onClick={async () => {
                const r = await deleteHistory([videoGroupId]);
                if (r.code === 200) {
                  showMessage({ children: '删除成功' });
                  setHistoryList(historyList.filter((item) => item.videoGroupId !== videoGroupId));
                  setTotal(total - 1);
                  setCurrentPage((c) => c - 1);
                }
              }}
            >
              删除
            </Button>
          </div>
        </div>
      </div>
      <hr className='mt-2 border-gray-200' />
    </>
  );
});

const HistoryList = memo(() => {
  const [historyList, setHistoryList] = useStore<HistoryListItemProps[]>('moe-video-history-list', []);
  const pageSize = useRef(5);
  const [total, setTotal] = useStore('moe-video-history-list-total', -1);
  useTitle('历史记录');

  useEffect(() => {
    setTotal(-1);

    getHistoryList(0, pageSize.current).then((res) => {
      setHistoryList(res.items);
      setTotal(res.total);
    });
  }, []);

  if (total === -1 && (!historyList || historyList.length === 0)) {
    return (
      <SkeletonCard
        type='strip'
        num={12}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      />
    );
  }

  if (total === 0 || !historyList || historyList.length === 0) {
    return (
      <div className='moe-video-space-page-history-list flex flex-col gap-4'>
        <div className='text-center text-gray-400'>暂无历史记录</div>
      </div>
    );
  }

  return (
    <InfinityList
      onIntersect={async (unloading) => {
        getHistoryList(historyList.length, pageSize.current).then((res) => {
          setHistoryList([...historyList, ...res.items]);
          unloading();
        });
      }}
      limit={total}
      itemNum={historyList?.length}
    >
      {historyList.length > 0 && (
        <div className='moe-video-space-page-history-list flex flex-col gap-4'>
          {historyList.map((item) => (
            <HistoryListItem key={item.videoGroupId} {...item} />
          ))}
        </div>
      )}
    </InfinityList>
  );
});

export default HistoryList;
