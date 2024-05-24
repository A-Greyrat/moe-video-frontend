import { memo, useCallback, useEffect, useRef } from 'react';
import './BangumiList.less';
import { Button, Image, Pagination, showMessage } from '@natsume_shiki/mika-ui';
import { useTitle } from '../../common/hooks';
import { deleteBangumiFavorite, getBangumiFavoriteList } from '../../common/video';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'mika-store';
import SkeletonCard from '../../component/SkeletonCard';

export interface BangumiListItemProps {
  id: string;
  title: string;
  cover: string;
  desc: string;
  url: string;
  lastWatchedIndex: number;
  lastWatchedTitle: string;

  pageSize: number;
}

export const BangumiListItem = memo((props: BangumiListItemProps) => {
  const { id, title, cover, desc, url, lastWatchedTitle, lastWatchedIndex, pageSize } = props;
  const navigate = useNavigate();
  const [bangumiList, setBangumiList] = useStore('moe-video-space-page-bangumi-list', []);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-bangumi-list-current-page', 1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_total, setTotal] = useStore('moe-video-space-page-bangumi-list-total', -1);

  return (
    <div className='moe-video-space-page-bangumi-list-item flex py-4 px-2'>
      <a
        href={lastWatchedIndex ? `${url}?p=${lastWatchedIndex}` : url}
        className='moe-video-space-page-bangumi-list-item-cover mr-4 overflow-hidden'
      >
        <Image lazy style={{ aspectRatio: '3 / 4', objectFit: 'cover', width: '9rem', height: '100%' }} src={cover} />
      </a>
      <div className='flex flex-col justify-between overflow-hidden'>
        <div>
          <div className='moe-video-space-page-bangumi-list-item-title pb-1 line-clamp-1'>
            {id ? title : '番剧被删除'}
          </div>
          {lastWatchedIndex && lastWatchedTitle ? (
            <div className='text-gray-400 text-xs line-clamp-1 mb-1'>
              看到第{lastWatchedIndex}集 {lastWatchedTitle}
            </div>
          ) : (
            <div className='text-gray-400 text-xs line-clamp-1 mb-1'>尚未观看</div>
          )}
          <div className='text-sm text-gray-550 line-clamp-5 whitespace-break-spaces pt-1 mb-2'>{id ? desc : ''}</div>
        </div>

        <div className='flex gap-2 mt-1'>
          <Button
            size='large'
            styleType='primary'
            style={{
              width: 'fit-content',
              fontSize: '1rem',
            }}
            onClick={() => {
              if (lastWatchedIndex) navigate(`${url}?p=${lastWatchedIndex}`);
              else navigate(url);
            }}
          >
            立即观看
          </Button>
          <Button
            size='large'
            styleType='default'
            style={{
              fontSize: '1rem',
              width: 'fit-content',
            }}
            onClick={() => {
              deleteBangumiFavorite([id]).then((r) => {
                if (r.code === 200) {
                  showMessage({ children: '取消追番成功' });
                  if (bangumiList.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    getBangumiFavoriteList(currentPage - 1, pageSize).then((res) => {
                      setBangumiList(res.items);
                      setTotal(res.total);
                    });
                  } else {
                    getBangumiFavoriteList(currentPage, pageSize).then((res) => {
                      setBangumiList(res.items);
                      setTotal(res.total);
                    });
                  }
                }
              });
            }}
          >
            取消追番
          </Button>
        </div>
      </div>
    </div>
  );
});

const BangumiList = memo(() => {
  useTitle('追番');
  const [bangumiList, setBangumiList] = useStore('moe-video-space-page-bangumi-list', []);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-bangumi-list-current-page', 1);
  const pageSize = useRef(10);
  const [total, setTotal] = useStore('moe-video-space-page-bangumi-list-total', -1);

  const handlePageChange = useCallback((index: number) => {
    setCurrentPage(index);

    getBangumiFavoriteList(index, pageSize.current).then((res) => {
      setBangumiList(res.items);
      setTotal(res.total);
    });
  }, []);

  useEffect(() => {
    setTotal(-1);

    handlePageChange(currentPage);
  }, []);

  if (total === -1 && bangumiList.length === 0) {
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

  if (total === 0 || !bangumiList || bangumiList.length === 0) {
    return (
      <div className='moe-video-space-page-history-list flex flex-col gap-4'>
        <div className='text-center text-gray-400'>暂无追番</div>
      </div>
    );
  }

  return (
    <div>
      {bangumiList.length > 0 && (
        <div className='moe-video-space-page-bangumi-list gap-4'>
          {bangumiList.map((item) => (
            <BangumiListItem key={item.id} {...item} pageSize={pageSize.current} />
          ))}
        </div>
      )}
      <Pagination
        key={total}
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

export default BangumiList;
