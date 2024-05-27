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
import { getCarouselList, getHomeIndexList, getRecommendList } from '../../common/video';
import './Home.less';

const Home = () => {
  window.scroll({ top: 0 });
  useTitle('首页');
  const [carouselItems, setCarouselItems] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [indexList, setIndexList] = useState([]);

  useEffect(() => {
    getCarouselList().then((res) => {
      setCarouselItems(res);
    });

    getHomeIndexList().then((res) => {
      setIndexList(res);
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
        <TimelineList />

        {/* 推荐列表 */}
        <RecommendList items={recommendList} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
