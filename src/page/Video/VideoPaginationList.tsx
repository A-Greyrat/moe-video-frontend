import { memo } from 'react';
import './VideoPaginationList.less';

export interface VideoPaginationListItemProps {
  index: string;
  title: string;
  videoId: string;
  url: string;
  duration: string;
  active?: boolean;
}

export interface VideoPaginationListProps {
  items: VideoPaginationListItemProps[];
  activeIndex?: number;
}

export const VideoPaginationListItem = memo((props: VideoPaginationListItemProps) => (
  <div className={`moe-video-video-page-pagination-item${props.active ? ' active' : ''}`}>
    <a href={props.url}>
      <span className='mr-1.5 font-bold'>{props.index}</span>
      <span className='line-clamp-1'>{props.title}</span>
      <span className='ml-1.5 text-gray-400'>{props.duration}</span>
    </a>
  </div>
));

const VideoPaginationList = memo((props: VideoPaginationListProps) => {
  const { items, activeIndex = 0 } = props;

  return (
    <div className='moe-video-video-page-pagination-list-wrapper'>
      <p className='moe-video-video-page-pagination-title'>视频列表</p>
      <div className='moe-video-video-page-pagination-list'>
        {items?.length &&
          items.map((item, index) => (
            <VideoPaginationListItem key={index} {...item} active={item.index === `P${activeIndex}`} />
          ))}
      </div>
    </div>
  );
});

export default VideoPaginationList;
