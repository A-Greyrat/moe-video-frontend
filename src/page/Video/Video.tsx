import React, { memo, useEffect, useMemo, useRef } from 'react';
import VideoPlayer, { DanmakuAttr, VideoSrc } from 'mika-video-player';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import VideoPageComment from './VideoPageComment.tsx';
import { useParams } from 'react-router-dom';
import VideoPageInfo, { VideoPageInfoProps } from './VideoPageInfo.tsx';
import VideoPaginationList from './VideoPaginationList.tsx';
import {
  getDanmaku,
  getLastWatchedProgress,
  getVideoInfo,
  getVideoUrl,
  postWatchProgress,
  VideoInfo,
} from '../../common/video';
import VideoRecommendList from './VideoRecommendList.tsx';
import { showMessage } from '@natsume_shiki/mika-ui';

import './Video.less';

const Video = memo(() => {
  const param = useParams();
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const p = useMemo(() => query.get('p'), [query]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [url, setUrl] = React.useState<string | VideoSrc | undefined>(undefined);
  const [danmakus, setDanmakus] = React.useState<DanmakuAttr[]>([]);
  const [item, setItem] = React.useState<VideoInfo>();

  const timer = useRef<number | null>(null);

  useEffect(() => {
    const vid = param.id;
    const heartbeatSendTime = 7000;
    let fn: () => void;
    let postProgress: () => void;

    getVideoInfo(vid).then((res) => {
      setItem(res);
      const index = p ? parseInt(p, 10) - 1 : 0;
      fn = () => {
        getLastWatchedProgress(res.pagination[index].videoId).then((res) => {
          if (res > 0 && videoRef.current) {
            videoRef.current.currentTime = res;
            showMessage({
              children: `上次观看到${new Date(res * 1000).toISOString().substr(11, 8)}，已为您自动跳转`,
            });
          }
        });
      };

      postProgress = () => {
        clearInterval(timer.current);
        timer.current = setInterval(() => {
          const currentTime = videoRef.current?.currentTime;
          postWatchProgress(res.pagination[index].videoId, currentTime).then(undefined);
        }, heartbeatSendTime);
      };

      videoRef.current?.addEventListener('play', fn, { once: true });
      videoRef.current?.addEventListener('play', postProgress);

      getVideoUrl(res.pagination[index].videoId).then((res) => {
        setUrl(res);
      });

      res.extra_id &&
        getDanmaku(res.extra_id, p).then((res) => {
          setDanmakus(res);
        });
    });

    return () => {
      videoRef.current?.removeEventListener('play', fn);
      videoRef.current?.removeEventListener('play', postProgress);
      clearInterval(timer.current);
    };
  }, [p, param.SESSDATA, param.id, query]);

  useEffect(() => {
    const gotoNext = () => {
      setTimeout(() => {
        const index = p ? parseInt(p, 10) : 1;
        if (index < item?.pagination.length) {
          window.location.href = `/video/${param.id}?p=${index + 1}`;
        }
      }, 1000);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('ended', gotoNext);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', gotoNext);
      }

      clearInterval(timer.current);
    };
  }, [item?.pagination.length, p, param.id]);

  return (
    <div className='moe-video-video-page-root'>
      <Header />
      <div className='moe-video-video-page-wrapper'>
        <div className='moe-video-page-video-container'>
          <VideoPlayer
            src={url}
            danmaku={danmakus}
            controls
            style={{
              borderRadius: '15px',
              height: 'fit-content',
              overflow: 'hidden',
              width: '100%',
            }}
            ref={videoRef}
          />
          {item && <VideoPageInfo {...(item as unknown as VideoPageInfoProps)} />}
        </div>
        {item && <VideoPageComment videoId={param.id} />}
        {item && <VideoPaginationList items={item.pagination} activeIndex={parseInt(p || '1', 10) - 1} />}
        {item && <VideoRecommendList items={item.recommendList} />}
      </div>
      <Footer />
    </div>
  );
});

export default Video;
