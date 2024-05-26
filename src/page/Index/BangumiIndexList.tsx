import { memo, useEffect, useState } from 'react';
import './BangumiIndexList.less';
import { Image } from '@natsume_shiki/mika-ui';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import { isUserLoggedInSync } from '../../common/user';
import { getBangumiIndexList, getLastWatchedIndex } from '../../common/video';
import SkeletonCard from '../../component/SkeletonCard';

export interface BangumiIndexListItemProps {
  id: string;
  title: string;
  cover: string;
  status: number;
  favoriteCnt: string;
  watchCnt: string;
  url: string;
}

interface BangumiIndexListProps {
  activeIndex: number;
}

export const BangumiIndexListItem = memo((props: BangumiIndexListItemProps) => {
  const { id, title, cover, status, favoriteCnt, watchCnt, url } = props;
  const [lastWatchedIndex, setLastWatchedIndex] = useState('1');

  useEffect(() => {
    if (isUserLoggedInSync()) getLastWatchedIndex(id).then((res) => setLastWatchedIndex(res));
  }, []);

  return (
    <a
      href={`${url}?p=${lastWatchedIndex}`}
      className='moe-video-bangumi-index-page-index-list-item-item overflow-hidden'
    >
      <div className='relative'>
        <Image lazy width='100%' style={{ aspectRatio: '3 / 4', objectFit: 'cover' }} src={cover} />
        <div className='moe-video-bangumi-index-page-index-list-item-cover-background'></div>
        <div className='absolute left-0 bottom-2 pt-6 px-2 w-full flex justify-between'>
          <div className='flex items-center gap-1.5'>
            <PlaybackVolumeIcon />
            <span className='text-white text-sm'>{watchCnt}</span>
          </div>
          <span className='text-white text-sm'>{favoriteCnt} 追番</span>
        </div>
      </div>
      <div className='px-2.5 flex flex-col pb-2.5 pt-1 gap-1'>
        <div className='line-clamp-1 font-medium'>{title}</div>
        <div className='text-gray-400 text-xs'>{status ? '连载中' : '已完结'}</div>
      </div>
    </a>
  );
});

const BangumiIndexList = memo((props: BangumiIndexListProps) => {
  const [indexList, setIndexList] = useState<BangumiIndexListItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { activeIndex } = props;

  useEffect(() => {
    getBangumiIndexList(activeIndex).then((res) => {
      setIndexList(res);
      setIsLoading(true);
    });
  }, [activeIndex]);

  return (
    <>
      {!isLoading && (
        <SkeletonCard
          className='moe-video-bangumi-index-page-index-list-item'
          style={{
            display: 'grid',
            width: '100%',
          }}
          num={15}
        />
      )}
      <div className='moe-video-bangumi-index-page-index-list-item grid gap-4 mb-10 mt-2 mr-4'>
        {indexList?.map((item) => <BangumiIndexListItem key={item.id} {...item} />)}
      </div>
    </>
  );
});

export default BangumiIndexList;
