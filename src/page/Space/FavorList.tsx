import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './FavorList.less';
import { Button, Image, Pagination, showMessage } from '@natsume_shiki/mika-ui';
import { useTitle } from '../../common/hooks';
import { deleteVideoFavorite, getLastWatchedIndex, getVideoFavoriteList } from '../../common/video';
import { useStore } from 'mika-store';
import SkeletonCard from '../../component/SkeletonCard';

export interface FavorListItemProps {
  id: string;
  title: string;
  cover: string;
  url: string;

  pageSize: number;
}

export const FavorListItem = memo((props: FavorListItemProps) => {
  const { id, title, cover, url, pageSize } = props;
  const [favorList, setFavorList] = useStore('moe-video-space-page-favor-list', []);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-favor-list-current-page', 1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_total, setTotal] = useStore('moe-video-space-page-favor-list-total', 0);
  const [lastWatchedIndex, setLastWatchedIndex] = useState('1');

  useEffect(() => {
    getLastWatchedIndex(id).then((index) => {
      setLastWatchedIndex(index);
    });
  }, []);

  return (
    <div className='moe-video-space-page-favor-list-item overflow-hidden'>
      <a href={`${url}?p=${lastWatchedIndex}`}>
        <div>
          <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        </div>
      </a>
      <div className='flex flex-col justify-between h-full'>
        <div className='moe-video-space-page-favor-list-item-title px-3 pt-2 mb-1 line-clamp-2'>{title}</div>
        <div className='flex justify-end px-3 pb-2 text-gray-400 items-center'>
          <Button
            size='large'
            styleType='default'
            style={{
              width: 'fit-content',
              fontSize: '1rem',
            }}
            onClick={() => {
              deleteVideoFavorite([id]).then((r) => {
                if (r.code === 200) {
                  showMessage({ children: '取消收藏成功' });
                  if (favorList.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    getVideoFavoriteList(currentPage - 1, pageSize).then((res) => {
                      setFavorList(res.items);
                      setTotal(res.total);
                    });
                  } else {
                    getVideoFavoriteList(currentPage, pageSize).then((res) => {
                      setFavorList(res.items);
                      setTotal(res.total);
                    });
                  }
                }
              });
            }}
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
  const [favorList, setFavorList] = useStore('moe-video-space-page-favor-list', []);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-favor-list-current-page', 1);
  const pageSize = useRef(10);
  const [total, setTotal] = useStore('moe-video-space-page-favor-list-total', -1);

  const handlePageChange = useCallback((index: number) => {
    setCurrentPage(index);
    setTotal(-1);

    getVideoFavoriteList(index, pageSize.current).then((res) => {
      setFavorList(res.items);
      setTotal(res.total);
    });
  }, []);

  useEffect(() => {
    handlePageChange(currentPage);
  }, []);

  if (total === -1 && favorList.length === 0) {
    return (
      <SkeletonCard
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
          gap: '1rem',
          width: '100%',
        }}
        num={12}
      />
    );
  }

  if (total === 0 || !favorList || favorList.length === 0) {
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
          {favorList.map((item) => (
            <FavorListItem key={item.id} {...item} pageSize={pageSize.current} />
          ))}
        </div>
      )}
      <Pagination
        initIndex={currentPage}
        pageNum={Math.ceil(total / pageSize.current)}
        onChange={(index) => {
          handlePageChange(index);
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
