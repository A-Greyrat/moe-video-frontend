import { memo } from 'react';
import './RecommendList.less';
import { Image } from '@natsume_shiki/mika-ui';
import PlayCountIcon from '../Icon/PlaybackVolumeIcon.tsx';
import LoveIcon from '../Icon/LoveIcon.tsx';
import SkeletonCard from '../../component/SkeletonCard';

export interface RecommendVideoListItemProps {
  title: string;
  cover: string;
  playCount: string;
  likeCount: string;
  author: string;
  uploadTime: string;
  url: string;
}

export interface RecommendBangumiListItemProps {
  title: string;
  cover: string;
  playCount: string;
  likeCount: string;
  lastUpdate: {
    // last update episode
    updateTo: number;
    // last update time
    updateAt: string;
  };
  url: string;
}

export interface RecommendListItemProps {
  data: RecommendVideoListItemProps | RecommendBangumiListItemProps;
  type?: string;
}

interface RecommendListProps {
  items: RecommendListItemProps[];
}

const RecommendBangumiListItem = memo((props: RecommendBangumiListItemProps) => {
  const { title, cover, playCount, likeCount, lastUpdate, url } = props;

  return (
    <a href={url} className='moe-video-home-page-recommend-list-item overflow-hidden'>
      <div className='relative'>
        <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        <div className='moe-video-home-page-recommend-list-item-cover-background'></div>
        <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light flex'>
          <div className='flex items-center gap-1'>
            <PlayCountIcon />
            <span>{playCount}</span>
          </div>
          <div className='flex items-center gap-1'>
            <LoveIcon />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between flex-auto'>
        <div className='moe-video-home-page-recommend-list-item-title px-3 pt-2 mb-3 line-clamp-2'>{title}</div>
        <div className='px-3 pb-3 text-gray-400 flex justify-between'>
          <span
            className='line-clamp-1'
            style={{
              maxWidth: 'calc(100% - 100px)',
            }}
          >
            {lastUpdate?.updateTo}
          </span>
          <span>{lastUpdate?.updateAt}</span>
        </div>
      </div>
    </a>
  );
});

const RecommendVideoListItem = memo((_props: RecommendVideoListItemProps) => {
  const { title, cover, playCount, likeCount, author, uploadTime, url } = _props;

  return (
    <a href={url} className='moe-video-home-page-recommend-list-item overflow-hidden'>
      <div className='relative flex-grow-0 flex-shrink-0'>
        <Image key={url} width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} lazy />
        <div className='moe-video-home-page-recommend-list-item-cover-background'></div>
        <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light flex'>
          <div className='flex items-center gap-1'>
            <PlayCountIcon />
            <span>{playCount}</span>
          </div>
          <div className='flex items-center'>
            <LoveIcon />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between flex-auto'>
        <div className='moe-video-home-page-recommend-list-item-title px-3 pt-2 mb-3 line-clamp-2'>{title}</div>
        <div className='px-3 pb-3 text-gray-400 flex justify-between'>
          <span>{author}</span>
          <span>{uploadTime}</span>
        </div>
      </div>
    </a>
  );
});

export const RecommendListItem = memo((props: RecommendListItemProps) => {
  const { type, data } = props;

  switch (type) {
    case 'video':
      return <RecommendVideoListItem {...(data as RecommendVideoListItemProps)} />;
    case 'bangumi':
      return <RecommendBangumiListItem {...(data as RecommendBangumiListItemProps)} />;
    default:
      throw new Error('Invalid type');
  }
});

const RecommendList = memo((props: RecommendListProps) => {
  const { items } = props;

  return (
    <>
      <div className='flex items-center pb-2'>
        <span className='text-3xl font-medium text-gray-800'>猜你喜欢</span>
      </div>
      {items?.length === 0 && (
        <SkeletonCard
          num={12}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
            gap: '1rem',
            width: '100%',
          }}
        />
      )}
      <div className='moe-video-home-page-recommend-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
        {items?.length > 0 && items.map((item) => <RecommendListItem key={item.data.url} {...item} />)}
      </div>
    </>
  );
});

export default RecommendList;
