import { memo } from 'react';
import './IndexList.less';

export interface IndexListItemProps {
  title: string;
  items: {
    tag: string;
    url: string;
  }[];
}

interface IndexListProps {
  indexList: IndexListItemProps[];
}

export const IndexListItem = memo((props: IndexListItemProps) => {
  const { items, title } = props;

  return (
    <div className='moe-video-home-page-index-item-wrapper'>
      <div className='moe-video-home-page-index-item-title cursor-pointer'>{title}</div>
      <div className='moe-video-home-page-index-item-list'>
        {items.map((item, index) => (
          <div className='moe-video-home-page-index-item line-clamp-1' key={index}>
            <a href={item.url}>{item.tag}</a>
          </div>
        ))}
      </div>
    </div>
  );
});

const IndexList = memo((props: IndexListProps) => {
  const { indexList } = props;

  return (
    <div className='moe-video-home-page-index-wrapper grid grid-cols-4 gap-4 my-12'>
      {indexList?.map((item, index) => <IndexListItem key={index} title={item.title} items={item.items} />)}
    </div>
  );
});

export default IndexList;
