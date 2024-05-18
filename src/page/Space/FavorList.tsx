import { memo, useEffect, useRef, useState } from 'react';
import './FavorList.less';
import { Button, Image, Pagination } from '@natsume_shiki/mika-ui';
import { useTitle } from '../../common/hooks';
import { getVideoFavoriteList } from '../../common/video';

export interface FavorListItemProps {
  title: string;
  cover: string;
  favorTime: string;
  url: string;
}

export const FavorListItem = memo((props: FavorListItemProps) => {
  const { title, cover, favorTime, url } = props;

  return (
    <div className='moe-video-space-page-favor-list-item overflow-hidden'>
      <a href={url}>
        <div>
          <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        </div>
      </a>
      <div className='flex flex-col justify-between h-full'>
        <div className='moe-video-space-page-favor-list-item-title px-3 pt-1 mb-1 line-clamp-2'>{title}</div>
        <div className='flex justify-between px-3 pb-2 text-gray-400 items-center'>
          <span>收藏于: {favorTime}</span>
          <Button
            size='large'
            styleType='default'
            style={{
              width: 'fit-content',
              fontSize: '1rem',
            }}
            onClick={() => {}}
          >
            取消收藏
          </Button>
        </div>
      </div>
    </div>
  );
});

const FavorList = memo(() => {
  useTitle('收藏');
  const [favorList, setFavorList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useRef(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getVideoFavoriteList(currentPage, pageSize.current).then((res) => {
      setFavorList(res.items);
      setTotal(res.total);
    });
  }, [currentPage]);

  if (total === 0) {
    return (
      <div className='moe-video-space-page-history-list flex flex-col gap-4'>
        <div className='text-center text-gray-400'>暂无收藏</div>
      </div>
    );
  }

  return (
    <div>
      {favorList.length > 0 && (
        <div className='moe-video-space-page-favor-list pt-2 pb-4 px-1 mb-12 gap-4'>
          {favorList.map((item, index) => (
            <FavorListItem key={index} {...item} />
          ))}
        </div>
      )}
      <Pagination
        pageNum={Math.ceil(total / pageSize.current)}
        onChange={(index) => {
          setCurrentPage(index);
        }}
        style={{
          width: 'fit-content',
          margin: '1rem auto',
        }}
      />
    </div>
  );
});

export default FavorList;
