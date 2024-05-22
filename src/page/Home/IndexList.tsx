import { memo } from 'react';
import './IndexList.less';

export interface IndexListItemProps {
  title: string;
  items: string[];
}

interface IndexListProps {
  indexList: IndexListItemProps[];
}

export const IndexListItem = memo((props: IndexListItemProps) => {
  const { items, title } = props;

  return (
    <div className={'moe-video-home-page-index-item-wrapper'}>
      <div className='moe-video-home-page-index-item-title cursor-pointer'>{title}</div>
      <div className='moe-video-home-page-index-item-list'>
        {items.map((item, index) => (
          <div className='moe-video-home-page-index-item' key={index}>
            <a href={`/bangumi/index`}>{item}</a>
          </div>
        ))}
      </div>
    </div>
  );
});

const IndexList = memo((props: IndexListProps) => {
  const { indexList } = props;

  return (
    <div className='moe-video-home-page-index-wrapper flex gap-4 my-12'>
      {indexList?.map((item, index) => <IndexListItem key={index} title={item.title} items={item.items} />)}
    </div>
  );
});

export default IndexList;
