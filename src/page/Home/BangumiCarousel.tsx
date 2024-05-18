import { memo } from 'react';
import { Carousel, Image } from '@natsume_shiki/mika-ui';
import './BangumiCarousel.less';

export interface BangumiCarouselItemProps {
  title: string;
  cover: string;
  desc: string;
  url: string;
}

export interface BangumiCarouselProps {
  items: BangumiCarouselItemProps[];
}

export const BangumiCarouselItem = memo((props: BangumiCarouselItemProps) => (
  <a href={props.url} className='moe-video-home-page-carousel-item relative'>
    <Image lazy width='100%' style={{ aspectRatio: '5 / 2' }} src={props.cover} />
    <div className='absolute left-0 bottom-0 bg-black opacity-50 pt-4 pb-6 px-6 w-full'>
      <div className='text-white text-3xl font-bold mb-2 flex items-baseline'>
        <span
          className='line-clamp-1'
          style={{
            maxWidth: '80%',
          }}
        >
          {props.title}
        </span>
        <span className='text-base font-normal ml-2.5 bg-red-500 px-2 py-0.5 rounded-lg'>9.9分</span>
      </div>
      <div className='text-white text-base line-clamp-2'>{props.desc}</div>
    </div>
  </a>
));

const BangumiCarousel = memo((props: BangumiCarouselProps) => {
  const { items } = props;

  return (
    <Carousel
      className='moe-video-home-page-carousel rounded-lg'
      items={items.map((item, index) => (
        <BangumiCarouselItem key={index} {...item} />
      ))}
      autoSwitchByTime={5000}
    />
  );
});

export default BangumiCarousel;
