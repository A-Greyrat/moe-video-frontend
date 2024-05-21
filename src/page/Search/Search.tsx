import { memo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../component/header/Header.tsx';
import { TabList } from '@natsume_shiki/mika-ui';
import './Search.less';
import Footer from '../../component/footer/Footer.tsx';
import SearchList from './SearchList.tsx';
import { useTitle } from '../../common/hooks';
import VideoSearchList from './VideoSearchList.tsx';
import BangumiSearchList from './BangumiSearchList.tsx';

const Search = memo(() => {
  const { id, type = '' } = useParams();
  useTitle(`搜索 - ${id}`);
  const [activeIndex, setActiveIndex] = useState(type === 'video' ? 1 : type === 'bangumi' ? 2 : 0);
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className='moe-video-search-page-wrapper'>
        <TabList
          items={['综合', '视频', '番剧']}
          activeIndex={activeIndex}
          onChange={(index) => {
            if (index === activeIndex) return;

            setActiveIndex(index);
            const type = index === 0 ? '' : index === 1 ? '/video' : '/bangumi';
            navigate(`/search${type}/${id}/1`);
          }}
          className='moe-video-search-page-list-tab'
          style={{
            marginBottom: '1rem',
            padding: '0.2rem 1rem',
            justifyContent: 'space-between',
          }}
        />

        {/* 搜索列表 */}
        {activeIndex === 0 && <SearchList />}

        {activeIndex === 1 && <VideoSearchList />}

        {activeIndex === 2 && <BangumiSearchList />}
      </div>
      <Footer />
    </div>
  );
});

Search.displayName = 'Search';
export default Search;
