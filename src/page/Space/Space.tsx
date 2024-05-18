import { memo, useEffect, useState } from 'react';
import Header from '../../component/header/Header.tsx';
import Footer from '../../component/footer/Footer.tsx';
import { Button, Image, TabList } from '@natsume_shiki/mika-ui';
import './Space.less';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import HistoryList from './HistoryList.tsx';
import Setting from './Setting.tsx';

const favorList1 = [
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    favorTime: '2024-5-16',
    url: '#',
  },
];

const bangumiList1 = [
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/img.png',
    desc: '《名侦探柯南：犯人犯泽先生》改编自同名漫画。该动画的主人公犯人犯泽先生身穿紧身服、全身漆黑。为了收拾某个人，他拼命打工赚钱，攒够钱后，他告别母亲，独自离开老家岛根县的出云，来到犯罪率极高的米花町准备复仇。外表凶悍的犯泽先生其实是个老实人，没有任何的犯罪经验，而且还非常胆小。从乡下来到大都市的他本以为能顺顺利利地展开计划，但现实并不美好，他面临租房、工作、人际关系等问题。在一次次的遭遇挫折后，他没有灰心丧气，仍不畏艰难地一步步解决生活中出现的问题，并最终在米花町租到了合适的房子，结交了新的朋友，还找到了满意的工作，让生活步上了正轨。然而，他却始终找不到自己要找的人。犯泽先生最终是否能顺利完成自己的计划呢？',
    lastWatchedAt: '第5话 迷宫与妖精',
    updateTo: '更新至第19话',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/img.png',
    desc: '《名侦探柯南：犯人犯泽先生》改编自同名漫画。该动画的主人公犯人犯泽先生身穿紧身服、全身漆黑。为了收拾某个人，他拼命打工赚钱，攒够钱后，他告别母亲，独自离开老家岛根县的出云，来到犯罪率极高的米花町准备复仇。外表凶悍的犯泽先生其实是个老实人，没有任何的犯罪经验，而且还非常胆小。从乡下来到大都市的他本以为能顺顺利利地展开计划，但现实并不美好，他面临租房、工作、人际关系等问题。在一次次的遭遇挫折后，他没有灰心丧气，仍不畏艰难地一步步解决生活中出现的问题，并最终在米花町租到了合适的房子，结交了新的朋友，还找到了满意的工作，让生活步上了正轨。然而，他却始终找不到自己要找的人。犯泽先生最终是否能顺利完成自己的计划呢？',
    lastWatchedAt: '第5话 迷宫与妖精',
    updateTo: '已完结',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/img.png',
    desc: '《名侦探柯南：犯人犯泽先生》改编自同名漫画。该动画的主人公犯人犯泽先生身穿紧身服、全身漆黑。为了收拾某个人，他拼命打工赚钱，攒够钱后，他告别母亲，独自离开老家岛根县的出云，来到犯罪率极高的米花町准备复仇。外表凶悍的犯泽先生其实是个老实人，没有任何的犯罪经验，而且还非常胆小。从乡下来到大都市的他本以为能顺顺利利地展开计划，但现实并不美好，他面临租房、工作、人际关系等问题。在一次次的遭遇挫折后，他没有灰心丧气，仍不畏艰难地一步步解决生活中出现的问题，并最终在米花町租到了合适的房子，结交了新的朋友，还找到了满意的工作，让生活步上了正轨。然而，他却始终找不到自己要找的人。犯泽先生最终是否能顺利完成自己的计划呢？',
    lastWatchedAt: '第5话 迷宫与妖精',
    updateTo: '全20话',
    url: '#',
  },
];

const uploadList1 = [
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
  {
    title: '【名侦探柯南：百万美元的五棱星】超清未删减版观看（～已上传）中文字幕-',
    cover: '/Suzumiya_Haruhi_no_Shoushitsu.png',
    playCount: '1.2万',
    uploadTime: '2024-5-16',
    url: '#',
  },
];

const Space = memo(() => {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorList, setFavorList] = useState([]);
  const [bangumiList, setBangumiList] = useState([]);
  const [uploadList, setUploadList] = useState([]);

  useEffect(() => {
    // get user favor list, history list, etc.
    setFavorList([]);
    setBangumiList([]);
    setUploadList([]);
    setActiveIndex(
      pathname.split('/')[2] === 'favor'
        ? 0
        : pathname.split('/')[2] === 'bangumi'
          ? 1
          : pathname.split('/')[2] === 'upload'
            ? 2
            : pathname.split('/')[2] === 'history'
              ? 3
              : pathname.split('/')[2] === 'setting'
                ? 4
                : 0,
    );
    if (activeIndex === 0) {
      setFavorList(favorList1);
    } else if (activeIndex === 1) {
      setBangumiList(bangumiList1);
    } else if (activeIndex === 2) {
      setUploadList(uploadList1);
    }
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
        {favorList.length > 0 && (
          <div className='moe-video-space-page-favor-list pt-2 pb-4 px-1 mb-12 gap-4'>
            {favorList.map((item, index) => (
              <div className='moe-video-space-page-favor-list-item overflow-hidden' key={index}>
                <a href={item.url}>
                  <div>
                    <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={item.cover} />
                  </div>
                  <div className='flex flex-col justify-between'>
                    <div className='moe-video-space-page-favor-list-item-title px-3 pt-1 mb-1 line-clamp-2'>
                      {item.title}
                    </div>
                  </div>
                </a>
                <div className='flex justify-between px-3 pb-2 text-gray-400 items-center'>
                  <span>收藏于: {item.favorTime}</span>
                  <Button
                    size='large'
                    styleType='default'
                    style={{
                      width: 'fit-content',
                      fontSize: '1rem',
                    }}
                    onClick={() => {}}
                  >
                    取消收藏
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 追番列表 */}
        {bangumiList.length > 0 && (
          <div className='moe-video-space-page-bangumi-list gap-4'>
            {bangumiList.map((item, index) => (
              <div className='moe-video-space-page-bangumi-list-item flex py-4 px-2' key={index}>
                <a href={item.url} className='moe-video-space-page-bangumi-list-item-cover mr-4 overflow-hidden'>
                  <Image lazy width='100%' style={{ aspectRatio: '3 / 4', objectFit: 'cover' }} src={item.cover} />
                </a>
                <div className='flex flex-col justify-between overflow-hidden'>
                  <div>
                    <div className='moe-video-space-page-bangumi-list-item-title pb-1 line-clamp-1'>{item.title}</div>
                    <div className='text-gray-400 text-xs line-clamp-1'>{item.updateTo}</div>
                    <div className='text-sm text-gray-550 line-clamp-4 whitespace-break-spaces pt-1 mb-2'>
                      {item.desc}
                    </div>
                    <div className='text-gray-400 text-xs line-clamp-1 mb-1'>看到 {item.lastWatchedAt}</div>
                  </div>

                  <div className='flex gap-2 mt-1'>
                    <Button
                      size='large'
                      styleType='primary'
                      style={{
                        width: 'fit-content',
                        fontSize: '1rem',
                      }}
                    >
                      立即观看
                    </Button>
                    <Button
                      size='large'
                      styleType='default'
                      style={{
                        fontSize: '1rem',
                        width: 'fit-content',
                      }}
                    >
                      取消追番
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 投稿列表 */}
        {uploadList.length > 0 && (
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

        {/* 分页 */}
      </div>
      <Footer />
    </div>
  );
});

Space.displayName = 'Space';
export default Space;
