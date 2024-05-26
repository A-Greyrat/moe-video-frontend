import { memo, useState } from 'react';
import './FilterList.less';

export interface FilterListProps {
  items: string[];
  typeName: string;
}

const FilterList = memo((props: FilterListProps) => {
  const { items, typeName } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='flex gap-2'>
      <span className='text-gray-400 whitespace-nowrap mr-2'>{typeName}</span>
      <div className='moe-video-bangumi-index-page-index-list-search'>
        <div key={0} className={`${activeIndex === 0 ? 'active' : ''}`} onClick={() => setActiveIndex(0)}>
          全部
        </div>
        {items?.map((item, index) => (
          <div
            key={index + 1}
            className={`${activeIndex === index + 1 ? 'active' : ''}`}
            onClick={() => setActiveIndex(index + 1)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});

export default FilterList;
