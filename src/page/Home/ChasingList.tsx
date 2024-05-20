import { memo, useEffect, useRef, useState } from 'react';
import './ChasingList.less';
import { Image } from '@natsume_shiki/mika-ui';
import { getBangumiFavoriteList } from '../../common/video';

interface ChasingListItem {
  id: string;
  title: string;
  cover: string;
  lastWatchedIndex: string;
  lastWatchedTitle: string;
  url: string;
}

export const ChasingListItem = memo((props: ChasingListItem) => {
  const { title, cover, lastWatchedTitle, lastWatchedIndex, url } = props;

  return (
    <a href={`${url}?p=${lastWatchedIndex}`} className='moe-video-home-page-chasing-list-item overflow-hidden'>
      <div className='relative'>
        <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        <div className='moe-video-home-page-chasing-list-item-cover-background'></div>
        {lastWatchedIndex && lastWatchedTitle ? (
          <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light line-clamp-1'>
            看到第{lastWatchedIndex}集 {lastWatchedTitle}
          </div>
        ) : (
          <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light line-clamp-1'>
            尚未观看
          </div>
        )}
      </div>
      <div className='moe-video-home-page-chasing-list-item-title px-3 pt-2 pb-1 line-clamp-2'>{title}</div>
    </a>
  );
});

const ChasingList = memo(() => {
  const [chasingList, setChasingList] = useState<ChasingListItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_total, setTotal] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, _setCurrentPage] = useState(1);
  const pageSize = useRef(20);

  useEffect(() => {
    getBangumiFavoriteList(currentPage, pageSize.current).then((res) => {
      setChasingList(res.items);
      setTotal(res.total);
    });
  }, []);

  return (
    <>
      {chasingList.length > 0 && (
        <div className={'moe-video-home-page-chasing-list-wrapper'}>
          <div className='flex items-center pb-2'>
            <img className='h-11' src='/chasing.png' alt='' />
            <span className='text-3xl font-medium ml-2 text-gray-800'>我的追番</span>
          </div>

          <div className='moe-video-home-page-chasing-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
            {chasingList.map((item) => (
              <ChasingListItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
});

export default ChasingList;
