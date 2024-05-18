import { memo, useEffect, useState } from 'react';
import Header from '../../component/header/Header.tsx';
import Footer from '../../component/footer/Footer.tsx';
import { Image, TabList } from '@natsume_shiki/mika-ui';
import './Space.less';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import HistoryList from './HistoryList.tsx';
import Setting from './Setting.tsx';
import FavorList from './FavorList.tsx';
import BangumiList from './BangumiList.tsx';

const TypeIndexMapping: {
  [key: string]: number;
} = {
  space: 0,
  favor: 0,
  bangumi: 1,
  upload: 2,
  history: 3,
  setting: 4,
};

const Space = memo(() => {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadList, setUploadList] = useState([]);

  useEffect(() => {
    // get user favor list, history list, etc.
    setActiveIndex(TypeIndexMapping[pathname.split('/').pop() || 'favor']);
  }, [pathname, activeIndex]);

  return (
    <div>
      <Header />
      <div className='moe-video-space-page-wrapper'>
        <TabList
          items={['收藏', '追番', '投稿', '历史', '设置']}
          key={pathname}
          activeIndex={activeIndex}
          onChange={(index) => {
            setActiveIndex(index);
            nav(`/space/${['favor', 'bangumi', 'upload', 'history', 'setting'][index]}`);
          }}
          style={{
            justifyContent: 'space-around',
            padding: '0.2rem 1rem',
            marginBottom: '1rem',
            marginTop: '0.5rem',
          }}
          className='moe-video-space-page-tab'
        />

        {/* 收藏列表 */}
        {activeIndex === 0 && <FavorList />}

        {/* 追番列表 */}
        {activeIndex === 1 && <BangumiList />}

        {/* 投稿列表 */}
        {activeIndex === 2 && uploadList.length > 0 && (
          <div className='moe-video-space-page-upload-list gap-4'>
            {uploadList.map((item, index) => (
              <a href={item.url} className='moe-video-space-page-upload-list-item overflow-hidden' key={index}>
                <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={item.cover} />
                <div className='moe-video-space-page-upload-list-item-title px-3 pt-1 mb-1 line-clamp-2'>
                  {item.title}
                </div>
                <div className='flex justify-between px-3 pb-1'>
                  <div className='flex items-center gap-1 text-gray-400'>
                    <PlaybackVolumeIcon fill={'currentColor'} />
                    <span className='text-sm'>{item.playCount}</span>
                  </div>
                  <div className='text-gray-400 text-sm'>{item.uploadTime}</div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 历史记录 */}
        {activeIndex === 3 && <HistoryList />}

        {/* 设置 */}
        {activeIndex === 4 && <Setting />}
      </div>
      <Footer />
    </div>
  );
});

Space.displayName = 'Space';
export default Space;
