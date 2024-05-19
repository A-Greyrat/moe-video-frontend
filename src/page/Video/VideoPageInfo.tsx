import React, { memo, useCallback, useEffect, useState } from 'react';
import PlaybackVolumeIcon from '../Icon/PlaybackVolumeIcon.tsx';
import LikeIcon from '../Icon/LikeIcon.tsx';
import DanmakuIcon from '../Icon/DanmakuIcon.tsx';
import FavoriteIcon from '../Icon/FavoriteIcon.tsx';
import { useParams } from 'react-router-dom';
import { useTitle } from '../../common/hooks';
import ReportIcon from '../Icon/ReportIcon.tsx';
import { favoriteVideoGroup, likeVideoGroup, removeFavoriteVideoGroup } from '../../common/video';
import { Image, showMessage, showModal } from '@natsume_shiki/mika-ui';
import './VideoPageInfo.less';

export interface VideoPageInfoProps {
  title: string;
  tags: string[];
  playCount: string;
  likeCount: string;
  danmakuCount: string;
  favoriteCount: string;
  description: string;
  isUserLiked: boolean;
  isUserFavorite: boolean;
  uploader: {
    nickname: string;
    avatar: string;
  };
}

const isTextOverflow = (element: HTMLElement | null, line: number) => {
  if (element === null) return false;
  const lineHeight = parseInt(getComputedStyle(element).lineHeight, 10);
  return element.scrollHeight > lineHeight * line;
};

const VideoPageInfo = memo((props: VideoPageInfoProps) => {
  const {
    tags,
    playCount,
    likeCount,
    danmakuCount,
    favoriteCount,
    title,
    description,
    isUserLiked,
    isUserFavorite,
    uploader,
  } = props;
  const param = useParams();

  useTitle(props.title);
  const [showMore, setShowMore] = useState(false);
  const [displayMoreButton, setDisplayMoreButton] = useState(false);

  const [userLiked, setUserLiked] = React.useState(isUserLiked);
  const [userFavorite, setUserFavorite] = React.useState(isUserFavorite);
  const formRef = React.useRef<HTMLFormElement>(null);

  const likeVideo = useCallback(() => {
    likeVideoGroup(param.id, !userLiked).then((res) => {
      if (res.code !== 200) {
        showMessage({ children: '点赞失败' });
        return;
      }

      setUserLiked(!userLiked);
      showMessage({ children: !userLiked ? '点赞成功' : '取消点赞成功' });
    });
  }, [param.id, userLiked]);

  const favoriteVideo = useCallback(() => {
    if (!userFavorite) {
      favoriteVideoGroup(param.id).then((res) => {
        if (res.code !== 200) {
          showMessage({ children: '收藏失败' });
          return;
        }
        setUserFavorite(!userFavorite);
        showMessage({ children: '收藏成功' });
      });
    } else {
      removeFavoriteVideoGroup([param.id]).then((res) => {
        if (res.code !== 200) {
          showMessage({ children: res.msg });
          return;
        }

        setUserFavorite(!userFavorite);
        showMessage({ children: '取消收藏成功' });
      });
    }
  }, [param.id, userFavorite]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setDisplayMoreButton(isTextOverflow(document.querySelector('.moe-video-video-page-description'), 5));
    });
    resizeObserver.observe(document.querySelector('.moe-video-video-page-description')!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className='moe-video-video-page-info'>
      <h1 className='moe-video-video-page-title'>{title}</h1>

      <div className='moe-video-video-page-count'>
        <span
          className='select-none'
          style={{
            padding: '0.2rem 0.5rem',
          }}
        >
          <Image
            src={uploader.avatar || '/defaultAvatar.webp'}
            lazy
            style={{
              aspectRatio: '1 / 1',
              height: '1.8rem',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <p>{uploader.nickname}</p>
        </span>
        <span className='select-none'>
          <PlaybackVolumeIcon />
          {playCount}
        </span>
        <span
          onClick={likeVideo}
          className='cursor-pointer select-none'
          style={{ backgroundColor: userLiked ? '#b796c0' : '' }}
        >
          <LikeIcon />
          {parseInt(likeCount, 10) + (userLiked ? 1 : 0)}
        </span>
        <span>
          <DanmakuIcon />
          {danmakuCount}
        </span>
        <span
          className='select-none cursor-pointer'
          onClick={favoriteVideo}
          style={{ backgroundColor: userFavorite ? '#b796c0' : '' }}
        >
          <FavoriteIcon />
          {parseInt(favoriteCount, 10) + (userFavorite ? 1 : 0)}
        </span>
        <span
          className='select-none cursor-pointer'
          onClick={() => {
            showModal({
              title: '举报',
              content: (
                <form className='moe-video-video-page-report-modal' ref={formRef}>
                  <p>举报原因</p>
                  <select name='cause'>
                    <option>色情低俗</option>
                    <option>政治敏感</option>
                    <option>侵权</option>
                    <option>其他</option>
                  </select>
                  <p>举报说明</p>
                  <textarea name='description' />
                </form>
              ),

              onOk: () => {
                const form = new FormData(formRef.current!);
                showMessage({ children: <pre>{JSON.stringify(Object.fromEntries(form))}</pre> });
              },
              onCancel: () => {},
              footer: 'ok cancel',
            });
          }}
        >
          <ReportIcon />
          举报
        </span>
      </div>

      <div className={`moe-video-video-page-description ${showMore ? '' : 'line-clamp-5'}`}>
        <p>{description}</p>
      </div>
      <p
        className='moe-video-video-page-show-more'
        style={{ display: displayMoreButton ? 'block' : 'none' }}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? '收起' : '展开'}
      </p>

      <span className='moe-video-video-page-tags'>
        {tags?.length > 0 &&
          tags.map((tag, index) => (
            <span key={index} className='moe-video-video-page-tag'>
              {tag}
            </span>
          ))}
      </span>
    </div>
  );
});

export default VideoPageInfo;
