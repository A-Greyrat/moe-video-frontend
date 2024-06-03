import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoItem, VideoItemProps } from './SearchList.tsx';
import { searchVideo } from '../../common/video';
import SkeletonCard from '../../component/SkeletonCard';
import { Pagination } from '@natsume_shiki/mika-ui';
import './SearchList.less';

const VideoSearchList = memo(() => {
  const { id, page = '1', type } = useParams();
  const [videoSearchList, setVideoSearchList] = useState<VideoItemProps[]>([]);
  const [total, setTotal] = useState(-1);
  const pageSize = useRef(15);
  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (index: number) => {
      setTotal(-1);

      searchVideo(id, index, pageSize.current).then((res) => {
        setVideoSearchList(res.items);
        setTotal(res.total);
      });
    },
    [id, page],
  );

  useEffect(() => {
    const newPage = parseInt(page, 10);
    if (newPage >= 100 || newPage < 1) {
      navigate(`/search/${type}/${id}/1`);
    }
  }, [page]);

  useEffect(() => {
    handlePageChange(parseInt(page, 10));
  }, [id, page]);

  if (total === -1 && !videoSearchList && videoSearchList?.length === 0) {
    return (
      <SkeletonCard
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
          gap: '1rem',
          width: '100%',
        }}
        num={15}
      />
    );
  }

  if (total === 0 && (!videoSearchList || videoSearchList?.length === 0)) {
    return <div className='text-gray-400 text-center'>暂无搜索结果</div>;
  }

  if (total > 0 && parseInt(page, 10) > Math.ceil(total / pageSize.current)) navigate(`/404`);

  return (
    <>
      {videoSearchList?.length > 0 && (
        <div className='moe-video-search-page-video-list pt-2 pb-4 px-1 mb-12 gap-4'>
          {videoSearchList.map((item) => (
            <VideoItem key={item.id} {...item} />
          ))}
        </div>
      )}

      <Pagination
        key={parseInt(page, 10)}
        initIndex={parseInt(page, 10)}
        pageNum={Math.ceil(total / pageSize.current)}
        onChange={(index) => {
          handlePageChange(index);
          setTotal(-1);
          setVideoSearchList(null);
          navigate(`/search/${type}/${id}/${index}`);
          window.scrollTo({
            top: 0,
          });
        }}
        style={{
          width: 'fit-content',
          margin: '1rem auto',
        }}
      />
    </>
  );
});

export default VideoSearchList;
