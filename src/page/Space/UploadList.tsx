import { memo, useEffect, useState } from 'react';
import { Image, Pagination } from '@natsume_shiki/mika-ui';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import { getLastWatchedIndex, getUserUploadList } from '../../common/video';
import { useTitle } from '../../common/hooks';
import SkeletonCard from '../../component/SkeletonCard';

export interface UploadListItemProps {
  id: string;
  title: string;
  cover: string;
  playCount: number;
  uploadTime: string;
  url: string;
}

export const UploadListItem = memo((props: UploadListItemProps) => {
  const { id, title, cover, playCount, uploadTime, url } = props;
  const [lastWatchedIndex, setLastWatchedIndex] = useState(1);

  useEffect(() => {
    getLastWatchedIndex(id).then((index) => {
      setLastWatchedIndex(index);
    });
  }, []);

  return (
    <a href={`${url}?p=${lastWatchedIndex}`} className='moe-video-space-page-upload-list-item overflow-hidden'>
      <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
      <div className='moe-video-space-page-upload-list-item-title px-3 pt-2 mb-2 line-clamp-2'>{title}</div>
      <div className='flex justify-between px-3 pb-2'>
        <div className='flex items-center gap-1 text-gray-400'>
          <PlaybackVolumeIcon fill={'currentColor'} />
          <span className='text-sm'>{playCount}</span>
        </div>
        <div className='text-gray-400 text-sm'>{uploadTime}</div>
      </div>
    </a>
  );
});

const UploadList = memo(() => {
  useTitle('投稿');
  const [uploadList, setUploadList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(-1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, _setPageSize] = useState(10);

  useEffect(() => {
    setTotal(-1);

    getUserUploadList(currentPage, pageSize).then((res) => {
      setUploadList(res.items);
      setTotal(res.total);
    });
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

  if (uploadList.length === 0) {
    return <div className='moe-video-space-page-upload-list-empty text-center text-gray-400'>暂无投稿</div>;
  }

  return (
    <>
      <div className='moe-video-space-page-upload-list gap-4'>
        {uploadList.map((item) => (
          <UploadListItem key={item.id} {...item} />
        ))}
      </div>
      <Pagination
        style={{ width: 'fit-content', margin: '1rem auto' }}
        pageNum={Math.ceil(total / pageSize)}
        onChange={(page) => {
          setCurrentPage(page);
          getUserUploadList(page, pageSize).then((res) => {
            setUploadList(res.items);
          });
        }}
      />
    </>
  );
});

export default UploadList;
