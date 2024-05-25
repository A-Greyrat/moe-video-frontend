import { useTitle } from '../../common/hooks';
import Header from '../../component/header/Header.tsx';
import Footer from '../../component/footer/Footer.tsx';
import './BangumiIndex.less';
import { Image, TabList } from '@natsume_shiki/mika-ui';
import { useEffect, useState } from 'react';
import { getBangumiIndexList, getHomeIndexList } from '../../common/video';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import { useParams } from 'react-router-dom';
import SkeletonCard from '../../component/SkeletonCard';

const BangumiIndex = () => {
  useTitle('索引');
  const { id } = useParams();
  const [tabList, setTabList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(Number(id) || 0);
  const [activeTimeIndex, setActiveTimeIndex] = useState(0);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [indexList, setIndexList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getHomeIndexList().then((res) => {
      const tabList = res[0].items.map((item) => item.tag);
      const typeList = res[1].items.map((item) => item.tag);
      const timeList = res[2].items.map((item) => item.tag);
      setTabList(tabList);
      setTypeList(typeList);
      setTimeList(timeList);
    });

    getBangumiIndexList(activeIndex).then((res) => {
      setIndexList(res);
      setIsLoading(true);
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
            {!isLoading && (
              <SkeletonCard
                className='moe-video-bangumi-index-page-index-list-item'
                style={{
                  display: 'grid',
                  width: '100%',
                }}
                num={15}
              />
            )}
            <div className='moe-video-bangumi-index-page-index-list-item grid gap-4 mb-10 mt-2 mr-4'>
              {indexList?.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className='moe-video-bangumi-index-page-index-list-item-item overflow-hidden'
                >
                  <div className='relative'>
                    <Image lazy width='100%' style={{ aspectRatio: '3 / 4', objectFit: 'cover' }} src={item.cover} />
                    <div className='moe-video-bangumi-index-page-index-list-item-cover-background'></div>
                    <div className='absolute left-0 bottom-2 pt-6 px-2 w-full flex justify-between'>
                      <div className='flex items-center gap-1.5'>
                        <PlaybackVolumeIcon />
                        <span className='text-white text-sm'>{item.watchCnt}</span>
                      </div>
                      <span className='text-white text-sm'>{item.favoriteCnt} 追番</span>
                    </div>
                  </div>
                  <div className='px-2.5 flex flex-col pb-2.5 pt-1 gap-1'>
                    <div className='line-clamp-1 font-medium'>{item.title}</div>
                    <div className='text-gray-400 text-xs'>{item.status ? '连载中' : '已完结'}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* 筛选区域 */}
            <div className='flex flex-col gap-2'>
              <span className='text-xl font-medium'>筛选</span>
              <div className='flex gap-2'>
                <span className='text-gray-400 whitespace-nowrap mr-2'>年份</span>
                <div className='moe-video-bangumi-index-page-index-list-search'>
                  <div
                    key={0}
                    className={`${activeTimeIndex === 0 ? 'active' : ''}`}
                    onClick={() => setActiveTimeIndex(0)}
                  >
                    全部
                  </div>
                  {timeList?.map((item, index) => (
                    <div
                      key={index + 1}
                      className={`${activeTimeIndex === index + 1 ? 'active' : ''}`}
                      onClick={() => setActiveTimeIndex(index + 1)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex gap-2'>
                <span className='text-gray-400 whitespace-nowrap mr-2'>类型</span>
                <div className='moe-video-bangumi-index-page-index-list-search'>
                  <div
                    key={0}
                    className={`${activeTypeIndex === 0 ? 'active' : ''}`}
                    onClick={() => setActiveTypeIndex(0)}
                  >
                    全部
                  </div>
                  {typeList?.map((item, index) => (
                    <div
                      key={index + 1}
                      className={`${activeTypeIndex === index + 1 ? 'active' : ''}`}
                      onClick={() => setActiveTypeIndex(index + 1)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BangumiIndex;
