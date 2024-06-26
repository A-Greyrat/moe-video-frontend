import { useTitle } from '../../common/hooks';
import Header from '../../component/header/Header.tsx';
import Footer from '../../component/footer/Footer.tsx';
import './BangumiIndex.less';
import { TabList } from '@natsume_shiki/mika-ui';
import { useEffect, useState } from 'react';
import { getHomeIndexList } from '../../common/video';
import { useParams } from 'react-router-dom';
import BangumiIndexList from './BangumiIndexList.tsx';
import FilterList from './FilterList.tsx';

const BangumiIndex = () => {
  window.scroll({ top: 0 });
  useTitle('索引');
  const { id } = useParams();
  const [tabList, setTabList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(Number(id) || 0);

  useEffect(() => {
    getHomeIndexList().then((res) => {
      const tabList = res[0].items.map((item) => item.tag);
      const typeList = res[1].items.map((item) => item.tag);
      const timeList = res[2].items.map((item) => item.tag);
      setTabList(tabList);
      setTypeList(typeList);
      setTimeList(timeList);
    });
  }, [activeIndex]);

  return (
    <>
      <div className='moe-video-bangumi-index-page-wrapper'>
        <Header />
        <div>
          <TabList
            items={tabList}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
            style={{
              gap: '1rem',
              marginBottom: '1rem',
              padding: '0.2rem 1rem',
              justifyContent: 'flex-start',
            }}
          />

          <div className='moe-video-bangumi-index-page-index-list grid gap-4'>
            {/* 番剧区域 */}
            <BangumiIndexList activeIndex={activeIndex} key={activeIndex} />

            {/* 筛选区域 */}
            <div className='flex flex-col gap-2'>
              <span className='text-xl font-medium'>筛选</span>
              <FilterList items={timeList} typeName='年份' />
              <FilterList items={typeList} typeName='类型' />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BangumiIndex;
