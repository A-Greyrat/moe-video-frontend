import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './SearchList.less';
import { useNavigate, useParams } from 'react-router-dom';
import { searchBangumi } from '../../common/video';
import SkeletonCard from '../../component/SkeletonCard';
import { Pagination } from '@natsume_shiki/mika-ui';
import { BangumiItem, BangumiItemProps } from './SearchList.tsx';

const BangumiSearchList = memo(() => {
  const { id, page = '1', type } = useParams();
  const [bangumiSearchList, setBangumiSearchList] = useState<BangumiItemProps[]>([]);
  const [total, setTotal] = useState(-1);
  const pageSize = useRef(15);
  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (index: number) => {
      setTotal(-1);

      searchBangumi(id, index, pageSize.current).then((res) => {
        setBangumiSearchList(res.items);
        setTotal(res.total);
      });
    },
    [id, page],
  );

  useEffect(() => {
    if (parseInt(page, 10) >= 100 || parseInt(page, 10) < 1) navigate(`/search/${type}/${id}/1`);
  }, [page]);

  useEffect(() => {
    handlePageChange(parseInt(page, 10));
  }, [id, page]);

  if (total === -1 && !bangumiSearchList && bangumiSearchList?.length === 0) {
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

  if (total === 0 && (!bangumiSearchList || bangumiSearchList?.length === 0)) {
    return <div className='text-gray-400 text-center'>暂无搜索结果</div>;
  }

  return (
    <>
      {bangumiSearchList?.length > 0 && (
        <div className='moe-video-search-page-bangumi-list mb-12 gap-4 w-full'>
          {bangumiSearchList.map((item) => (
            <BangumiItem key={item.id} {...item} />
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
          setBangumiSearchList(null);
          navigate(`/search/${id}/${index}`);
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

export default BangumiSearchList;
