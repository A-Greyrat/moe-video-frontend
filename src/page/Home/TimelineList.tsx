import { memo, useEffect, useState } from 'react';
import './TimelineList.less';
import { Image, TabList } from '@natsume_shiki/mika-ui';
import { getNewBangumiTimeList } from '../../common/video';

interface TimelineListItem {
  title: string;
  cover: string;
  updateTime: string;
  updateTo: string;
  score: number;
  url: string;
}

export const TimelineListItem = memo((props: TimelineListItem) => {
  const { title, cover, updateTime, updateTo, score, url } = props;
  return (
    <a href={url} className='moe-video-home-page-timeline-list-item overflow-hidden max-w-52'>
      <div className='relative'>
        <Image width='100%' style={{ aspectRatio: '3 / 4' }} src={cover} lazy />
        <div className='absolute left-0 bottom-2 pt-6 px-2 w-full text-right text-2xl font-medium italic cursor-pointer'>
          <span className='text-white'>{score}</span>
        </div>
      </div>
      <div className='moe-video-home-page-timeline-list-item-title px-3 pt-2 pb-1'>{title}</div>
      <div className='px-3 pb-3 text-gray-400'>
        {updateTime} 更新至第{updateTo}集
      </div>
    </a>
  );
});

const TimelineList = memo(() => {
  const [timelineList, setTimelineList] = useState<TimelineListItem[][]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const date = new Date();
  const now = date.getDay();

  useEffect(() => {
    const timeList: TimelineListItem[][] = [];
    for (let i = 0; i <= 6; i++) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + i);
      const timeIndex = nextDate.getDay();
      const formattedDate = `${nextDate.getFullYear()}${String(nextDate.getMonth() + 1).padStart(2, '0')}${String(nextDate.getDate()).padStart(2, '0')}`;
      getNewBangumiTimeList(formattedDate).then((res) => {
        if (!timeIndex) {
          timeList[6] = res;
        } else {
          timeList[timeIndex - 1] = res;
        }
      });
    }
    setTimelineList(timeList);
  }, [now]);

  return (
    <>
      <div className='flex items-center pb-2'>
        <img className='h-11' src='/clock.png' alt='' />
        <span className='text-3xl font-medium ml-2 text-gray-800'>新番时间表</span>
      </div>

      <TabList
        items={['周一', '周二', '周三', '周四', '周五', '周六', '周日']}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        style={{
          justifyContent: 'space-between',
          padding: '0.2rem 1rem',
          marginBottom: '1rem',
          marginTop: '0.5rem',
        }}
        className='moe-video-home-page-timeline-list-tab'
      />

      <div className='moe-video-home-page-timeline-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
        {timelineList?.length > 0 &&
          timelineList[activeIndex].map((item, index) => <TimelineListItem key={index} {...item} />)}
      </div>
    </>
  );
});

export default TimelineList;
