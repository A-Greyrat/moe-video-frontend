import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../component/header/Header.tsx';
import { TabList, Pagination } from '@natsume_shiki/mika-ui';
import './Search.less';
import Footer from '../../component/footer/Footer.tsx';
import SearchList, { BangumiItemProps, VideoItemProps } from './SearchList.tsx';
import { searchBangumi, searchVideo } from '../../common/video';
import { useTitle } from '../../common/hooks';
import SkeletonCard from '../../component/SkeletonCard';

const Search = memo(() => {
  const { id, page = '1', type = '' } = useParams();
  useTitle(`搜索 - ${id}`);
  const [activeIndex, setActiveIndex] = useState(type === 'video' ? 1 : type === 'bangumi' ? 2 : 0);
  const [bangumiList, setBangumiList] = useState<BangumiItemProps[]>(null);
  const [videoList, setVideoList] = useState<VideoItemProps[]>(null);
  const [pageInfo, setPageInfo] = useState({
    total: -1,
    currentPage: parseInt(page, 10),
    pageSize: 15,
  });
  const navigate = useNavigate();

  const handlePageInfo = useCallback(
    (key: string, newInfo: any) => {
      const newPageInfo = { ...pageInfo };
      newPageInfo[key] = newInfo;
      setPageInfo(newPageInfo);
    },
    [pageInfo],
  );

  useEffect(() => {
    handlePageInfo('total', -1);

    searchBangumi(id, pageInfo.currentPage, pageInfo.pageSize).then((res) => {
      console.log(res);
      setBangumiList(res.items);
    });
    searchVideo(id, pageInfo.currentPage, pageInfo.pageSize).then((res) => {
      handlePageInfo('total', res.total);
      setVideoList(res.items);
    });
  }, [pageInfo.currentPage, id]);

  return (
    <div>
      <Header />
      <div className='moe-video-search-page-wrapper'>
        <TabList
          items={['综合', '视频', '番剧']}
          activeIndex={activeIndex}
          onChange={(index) => {
            setActiveIndex(index);
            const type = index === 0 ? '' : index === 1 ? '/video' : '/bangumi';
            navigate(`/search${type}/${id}/1`);
            handlePageInfo('currentPage', 1);
          }}
          className='moe-video-search-page-list-tab'
          style={{
            marginBottom: '1rem',
            padding: '0.2rem 1rem',
            justifyContent: 'space-between',
          }}
        />

        {pageInfo.total === -1 && (
          <SkeletonCard
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
              gap: '1rem',
              width: '100%',
            }}
            num={15}
          />
        )}

        {/* 搜索列表 */}
        {activeIndex === 0 && pageInfo.currentPage === 1 && bangumiList && videoList && (
          <SearchList bangumiList={bangumiList} videoList={videoList} />
        )}

        {activeIndex === 0 && bangumiList && videoList && pageInfo.currentPage !== 1 && (
          <SearchList videoList={videoList} />
        )}

        {activeIndex === 1 && bangumiList && videoList && <SearchList videoList={videoList} />}

        {activeIndex === 2 && bangumiList && videoList && <SearchList bangumiList={bangumiList} />}

        {activeIndex !== 2 && (
          <Pagination
            key={activeIndex}
            initIndex={parseInt(page, 10)}
            pageNum={Math.ceil(pageInfo.total / pageInfo.pageSize)}
            onChange={(index) => {
              handlePageInfo('currentPage', index);
              const type = activeIndex === 0 ? '' : activeIndex === 1 ? '/video' : '/bangumi';
              navigate(`/search${type}/${id}/${index}`);
            }}
            style={{
              width: 'fit-content',
              margin: '1rem auto',
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
});

Search.displayName = 'Search';
export default Search;
