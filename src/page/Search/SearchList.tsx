import { memo, useEffect, useState } from 'react';
import './SearchList.less';
import { Button, Image, showMessage } from '@natsume_shiki/mika-ui';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import LoveIcon from '../Icon/LoveIcon.tsx';
import { useNavigate } from 'react-router-dom';
import { deleteBangumiFavorite, favoriteVideoGroup, getLastWatchedIndex } from '../../common/video';

export interface BangumiItemProps {
  id: string;
  title: string;
  cover: string;
  score: string;
  desc: string;
  tags: string[];
  userFavorite: boolean;
  url: string;
}

export interface VideoItemProps {
  id: string;
  title: string;
  cover: string;
  playCount: string;
  likeCount: string;
  author: string;
  uploadTime: string;
  url: string;
}

interface SearchListProps {
  bangumiList?: BangumiItemProps[] | null;
  videoList?: VideoItemProps[] | null;
}

export const BangumiItem = memo((props: BangumiItemProps) => {
  const { id, title, cover, score, desc, tags, url, userFavorite } = props;
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(userFavorite ? 'Favorite' : 'NotFavorite');
  const [lastWatchedIndex, setLastWatchedIndex] = useState('1');

  useEffect(() => {
    getLastWatchedIndex(id).then((index) => {
      setLastWatchedIndex(index);
    });
  }, []);

  return (
    <div className='moe-video-search-page-bangumi-list-item flex py-2 px-2'>
      <a
        href={`${url}?p=${lastWatchedIndex}`}
        className='moe-video-search-page-bangumi-list-item-cover overflow-hidden mr-4'
      >
        <div className='relative w-full h-full'>
          <Image
            lazy
            width='100%'
            className='moe-video-search-page-bangumi-list-item-cover-img'
            style={{ aspectRatio: '3 / 4', objectFit: 'cover' }}
            src={cover}
          />
          <div className='absolute left-0 bottom-2 pt-6 px-2 w-full text-right text-2xl font-medium italic'>
            <span className='text-white'>{score}</span>
          </div>
        </div>
      </a>
      <div className='flex flex-col justify-between overflow-hidden'>
        <div>
          <div className='moe-video-search-page-bangumi-list-item-title pb-1 line-clamp-1'>{title}</div>
          <div className='flex gap-1 flex-wrap h-7 overflow-hidden'>
            {tags.length > 0 &&
              tags.map((tag, index) => (
                <div key={index} className='moe-video-search-page-bangumi-list-item-tag'>
                  {tag}
                </div>
              ))}
          </div>
          <div className='text-sm text-gray-500 line-clamp-4 whitespace-break-spaces my-2'>{desc}</div>
        </div>

        <div className='flex gap-2'>
          <Button
            size='large'
            styleType='primary'
            style={{
              width: 'fit-content',
              fontSize: '1rem',
            }}
            onClick={() => {
              navigate(`${url}?p=${lastWatchedIndex}`);
            }}
          >
            立即观看
          </Button>
          <Button
            key={isFavorite}
            size='large'
            styleType='default'
            style={{
              fontSize: '1rem',
              width: 'fit-content',
            }}
            onClick={() => {
              if (userFavorite) {
                deleteBangumiFavorite([id]).then((r) => {
                  if (r.code === 200) {
                    showMessage({ children: '取消追番成功' });
                    setIsFavorite('NotFavorite');
                  }
                });
              } else {
                favoriteVideoGroup(id).then((r) => {
                  if (r.code === 200) {
                    showMessage({ children: '追番成功' });
                    setIsFavorite('Favorite');
                  }
                });
              }
            }}
          >
            {isFavorite === 'Favorite' ? '取消追番' : '加入追番'}
          </Button>
        </div>
      </div>
    </div>
  );
});

export const VideoItem = memo((props: VideoItemProps) => {
  const { id, title, cover, playCount, likeCount, author, uploadTime, url } = props;
  const [lastWatchedIndex, setLastWatchedIndex] = useState('1');

  useEffect(() => {
    getLastWatchedIndex(id).then((index) => {
      setLastWatchedIndex(index);
    });
  }, []);

  return (
    <a href={`${url}?p=${lastWatchedIndex}`} className='moe-video-search-page-video-list-item overflow-hidden'>
      <div className='relative'>
        <Image lazy width='100%' style={{ aspectRatio: '5 / 3', objectFit: 'cover' }} src={cover} />
        <div className='moe-video-search-page-video-list-item-cover-background'></div>
        <div className='absolute left-3 bottom-2 gap-2 cursor-pointer text-white text-base font-light flex'>
          <div className='flex items-center gap-1'>
            <PlaybackVolumeIcon />
            <span>{playCount}</span>
          </div>
          <div className='flex items-center gap-1'>
            <LoveIcon />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between flex-auto'>
        <div className='moe-video-search-page-video-list-item-title px-3 pt-2 mb-3 line-clamp-2'>{title}</div>
        <div className='px-3 pb-3 text-gray-400 flex justify-between w-full'>
          <span>{author}</span>
          <span>{uploadTime}</span>
        </div>
      </div>
    </a>
  );
});

const SearchList = memo((props: SearchListProps) => {
  const { bangumiList, videoList } = props;

  return (
    <div>
      {bangumiList?.length > 0 && (
        <div className='moe-video-search-page-bangumi-list mb-12 gap-4 w-full'>
          {bangumiList.map((item) => (
            <BangumiItem key={item.id} {...item} />
          ))}
        </div>
      )}

      {videoList?.length > 0 && (
        <div className='moe-video-search-page-video-list pt-2 pb-4 px-1 mb-12 gap-4'>
          {videoList.map((item) => (
            <VideoItem key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
});

export default SearchList;
