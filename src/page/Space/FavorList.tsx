import { memo, useEffect, useRef } from 'react';
import './FavorList.less';
import { Button, Image, Pagination, showMessage } from '@natsume_shiki/mika-ui';
import { useTitle } from '../../common/hooks';
import { deleteVideoFavorite, getVideoFavoriteList } from '../../common/video';
import { useStore } from 'mika-store';

export interface FavorListItemProps {
  id: string;
  title: string;
  cover: string;
  favorTime: string;
  url: string;

  pageSize: number;
}

export const FavorListItem = memo((props: FavorListItemProps) => {
  const { id, title, cover, favorTime, url, pageSize } = props;
  const [favorList, setFavorList] = useStore('moe-video-space-page-favor-list', []);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-favor-list-current-page', 1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_total, setTotal] = useStore('moe-video-space-page-favor-list-total', 0);

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
            onClick={() => {
              deleteVideoFavorite([id]).then((r) => {
                if (r.code === 200) {
                  showMessage({ children: '取消收藏' });
                  if (favorList.length % pageSize === 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    getVideoFavoriteList(currentPage, pageSize).then((res) => {
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
  const [total, setTotal] = useStore('moe-video-space-page-favor-list-total', 0);

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
            <FavorListItem key={index} {...item} pageSize={pageSize.current} />
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
