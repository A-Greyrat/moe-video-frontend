import {memo, useCallback, useEffect, useState} from 'react';
import {Button, Image, Pagination, showMessage} from '@natsume_shiki/mika-ui';
import {deleteUserUpload, getLastWatchedIndex, getUserUploadList} from '../../common/video';
import { useTitle } from '../../common/hooks';
import SkeletonCard from '../../component/SkeletonCard';
import './UploadList.less';
import {useStore} from "mika-store";

export interface UploadListItemProps {
  id: string;
  title: string;
  cover: string;
  status: number;
  playCount: string;
  uploadTime: string;
  url: string;
  pageSize: number;
}

export const UploadListItem = memo((props: UploadListItemProps) => {
  const { id, title, cover, status, uploadTime, url, pageSize } = props;
  const [lastWatchedIndex, setLastWatchedIndex] = useState('1');
  const [uploadList, setUploadList] = useStore('moe-video-space-page-upload-list',[]);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-upload-list-current-page',1);
  const [_total, setTotal] = useStore('moe-video-space-page-upload-list-total',-1);

  useEffect(() => {
    getLastWatchedIndex(id).then(setLastWatchedIndex);
  }, []);

  return (
    <>
      <a href={`${url}?p=${lastWatchedIndex}`} className='moe-video-space-page-upload-list-item overflow-hidden'>
        <div className='relative'>
          <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
          {status === 2 && (
            <div className='moe-video-space-page-upload-list-item-status absolute left-2 top-2 bg-yellow-400 text-white'>
              转码中
            </div>
          )}
        </div>
        <div className='flex flex-col justify-between flex-auto'>
          <div className='moe-video-space-page-upload-list-item-title px-3 pt-2 mb-2 line-clamp-2'>
            {id ? title : '视频被删除'}
          </div>
          <div className='flex justify-between items-center pb-2'>
            <Button
              size='medium'
              styleType='link'
              style={{
                width: 'fit-content',
                fontSize: '1rem',
              }}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const r = await deleteUserUpload(id);
                if (r.code === 200) {
                  showMessage({ children: '删除成功' });
                  if (uploadList.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    getUserUploadList(currentPage - 1, pageSize).then((res) => {
                      setUploadList(res.items);
                      setTotal(res.total);
                    });
                  } else {
                    getUserUploadList(currentPage, pageSize).then((res_1) => {
                      setUploadList(res_1.items);
                      setTotal(res_1.total);
                    });
                  }
                } else {
                  showMessage({ children: r.msg });
                }
              }}
            >
              删除投稿
            </Button>
            <div className='text-gray-400 text-sm mr-3'>{id ? uploadTime : ''}</div>
          </div>
        </div>
      </a>
    </>
  );
});

const UploadList = memo(() => {
  useTitle('投稿');
  const [uploadList, setUploadList] = useStore('moe-video-space-page-upload-list', []);
  const [currentPage, setCurrentPage] = useStore('moe-video-space-page-upload-list-current-page', 1);
  const [total, setTotal] = useStore('moe-video-space-page-upload-list-total', -1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, _setPageSize] = useState(15);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setTotal(-1);

    getUserUploadList(page, pageSize).then((res) => {
      setUploadList(res.items);
      setTotal(res.total);
    });
  }, []);

  useEffect(() => {
    handlePageChange(currentPage);
  }, []);

  if (total === -1 && uploadList.length === 0) {
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

  if (total === 0 || !uploadList || uploadList.length === 0) {
    return <div className='moe-video-space-page-upload-list-empty text-center text-gray-400'>暂无投稿</div>;
  }

  return (
    <>
      <div className='moe-video-space-page-upload-list gap-4'>
        {uploadList.map((item) => (
          <UploadListItem key={item.id} {...item} pageSize={pageSize}/>
        ))}
      </div>
      <Pagination
        key={total}
        initIndex={currentPage}
        style={{width: 'fit-content', margin: '1rem auto'}}
        pageNum={Math.ceil(total / pageSize)}
        onChange={(page) => {
          handlePageChange(page);
          window.scrollTo({top: 0});
        }}
      />
    </>
  );
});

export default UploadList;
