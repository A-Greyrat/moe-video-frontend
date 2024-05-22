import React, { memo, useEffect, useMemo, useRef } from 'react';
import VideoPlayer, { DanmakuAttr, VideoSrc, TripleSpeedForward } from 'mika-video-player';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import VideoPageComment from './VideoPageComment.tsx';
import { useParams } from 'react-router-dom';
import VideoPageInfo, { VideoPageInfoProps } from './VideoPageInfo.tsx';
import VideoPaginationList from './VideoPaginationList.tsx';
import {
  addDanmaku,
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
    let getAllDanmaku: () => void;

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

      getAllDanmaku = () => {
        const i = Math.ceil(videoRef.current.duration / 60 / 6);
        const promises: Promise<DanmakuAttr[]>[] = [];
        for (let j = 1; j <= i; j++) {
          promises.push(getDanmaku(res.pagination[index].videoId, j));
        }

        Promise.all(promises).then((res) => {
          setDanmakus(res.flat());
        });
      };

      videoRef.current?.addEventListener('play', fn, { once: true });
      videoRef.current?.addEventListener('play', postProgress);
      videoRef.current?.addEventListener('loadedmetadata', getAllDanmaku, { once: true });

      getVideoUrl(res.pagination[index].videoId).then((res) => {
        setUrl(res);
      });
    });

    return () => {
      videoRef.current?.removeEventListener('play', fn);
      videoRef.current?.removeEventListener('play', postProgress);
      videoRef.current?.removeEventListener('loadedmetadata', getAllDanmaku);
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
            plugins={[TripleSpeedForward]}
            ref={videoRef}
            onSendDanmaku={(danmaku) => {
              if (danmaku.text.trim() === '') {
                showMessage({ children: '弹幕内容不能为空' });
                return false;
              }
              addDanmaku(
                item?.pagination[parseInt(p || '1', 10) - 1].videoId,
                danmaku.begin * 1000,
                danmaku.mode,
                danmaku.size,
                danmaku.color,
                0,
                danmaku.text,
              ).then((res) => {
                if (res.code === 200) {
                  showMessage({ children: '发送成功' });
                } else {
                  showMessage({ children: '发送失败' });
                }
              });

              return true;
            }}
          />
          {item && <VideoPageInfo {...(item as unknown as VideoPageInfoProps)} />}
        </div>
        {item && (
          <VideoPageComment key={10000 + item.pagination[p ? parseInt(p, 10) - 1 : 0].videoId} videoId={param.id} />
        )}
        {item && (
          <VideoPaginationList
            key={20000 + item.pagination[p ? parseInt(p, 10) - 1 : 0].videoId}
            items={item.pagination}
            activeIndex={parseInt(p || '1', 10) - 1}
          />
        )}
        {item && (
          <VideoRecommendList key={30000 + item.pagination[p ? parseInt(p, 10) - 1 : 0].videoId} items={item.recommendList} />
        )}
      </div>
      <Footer />
    </div>
  );
});

export default Video;
