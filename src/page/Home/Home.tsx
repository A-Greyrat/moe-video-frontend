import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { useTitle } from '../../common/hooks';
import BangumiCarousel from './BangumiCarousel.tsx';
import IndexList from './IndexList.tsx';
import ChasingList from './ChasingList.tsx';
import TimelineList from './TimelineList.tsx';
import RecommendList from './RecommendList.tsx';
import { useEffect, useState } from 'react';
import LoadingPage from '../Loading/LoadingPage.tsx';
import { getCarouselList, getRecommendList } from '../../common/video';

import './Home.less';

const indexList = [
  {
    title: '番剧索引',
    items: ['追番人数', '最高评分', '更新时间', '播放数量'],
  },
  {
    title: '类型风格',
    items: ['原创', '小说改', '特摄', '漫画改', '游戏改', '布袋戏'],
  },
  {
    title: '首播时间',
    items: ['2024', '2023', '2022', '2021', '2020', '2019'],
  },
  {
    title: '热搜',
    items: ['迷宫饭', '我独自升级'],
  },
];

const Home = () => {
  useTitle('首页');
  const [carouselItems, setCarouselItems] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeLineList, _setTimeLineList] = useState([]);
  const [recommendList, setRecommendList] = useState([]);

  useEffect(() => {
    getCarouselList().then((res) => {
      setCarouselItems(res);
    });

    getRecommendList().then((res) => {
      setRecommendList(res);
    });
  }, []);

  if (carouselItems.length === 0) return <LoadingPage />;

  return (
    <div className='moe-video-home-page-root'>
      <Header />
      <div className='moe-video-home-page-wrapper'>
        {/* 轮播图 */}
        <BangumiCarousel items={carouselItems} />

        {/* 索引列表 */}
        <IndexList indexList={indexList} />

        {/* 追番列表 */}
        <ChasingList />

        {/* 时间表 */}
        <TimelineList items={timeLineList} />

        {/* 推荐列表 */}
        <RecommendList items={recommendList} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
