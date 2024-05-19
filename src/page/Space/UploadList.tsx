import { memo, useEffect, useState } from 'react';
import { Image, Pagination } from '@natsume_shiki/mika-ui';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import { getUserUploadList } from '../../common/video';

const UploadList = memo(() => {
  const [uploadList, setUploadList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, _setPageSize] = useState(10);

  useEffect(() => {
    getUserUploadList(currentPage, pageSize).then((res) => {
      setUploadList(res.items);
      setTotal(res.total);
    });
  }, []);

  if (uploadList.length === 0) {
    return <div className='moe-video-space-page-upload-list-empty text-center text-gray-400'>暂无投稿</div>;
  }

  return (
    <>
      <div className='moe-video-space-page-upload-list gap-4'>
        {uploadList.map((item, index) => (
          <a href={item.url} className='moe-video-space-page-upload-list-item overflow-hidden' key={index}>
            <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={item.cover} />
            <div className='moe-video-space-page-upload-list-item-title px-3 pt-2 mb-2 line-clamp-2'>{item.title}</div>
            <div className='flex justify-between px-3 pb-2'>
              <div className='flex items-center gap-1 text-gray-400'>
                <PlaybackVolumeIcon fill={'currentColor'} />
                <span className='text-sm'>{item.playCount}</span>
              </div>
              <div className='text-gray-400 text-sm'>{item.uploadTime}</div>
            </div>
          </a>
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
