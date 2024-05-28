import React, { memo, useEffect, useMemo, useRef } from 'react';
import VideoPlayer, { DanmakuAttr, TripleSpeedForward, VideoSrc } from 'mika-video-player';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import VideoPageComment from './VideoPageComment.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPageInfo, { VideoPageInfoProps } from './VideoPageInfo.tsx';
import VideoPaginationList from './VideoPaginationList.tsx';
import {
  addDanmaku,
  getDanmaku,
  getLastWatchedProgress,
  getVideoInfo,
  getVideoUrl,
  postWatchCount,
  postWatchProgress,
  VideoInfo,
} from '../../common/video';
import VideoRecommendList from './VideoRecommendList.tsx';
import { showMessage } from '@natsume_shiki/mika-ui';

import './Video.less';
import { isUserLoggedInSync } from '../../common/user';
import LoadingPage from '../Loading/LoadingPage.tsx';

const Video = memo(() => {
  const param = useParams();
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const p = useMemo(() => query.get('p'), [query]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [url, setUrl] = React.useState<string | VideoSrc | undefined>(undefined);
  const [danmakus, setDanmakus] = React.useState<DanmakuAttr[]>([]);
  const [item, setItem] = React.useState<VideoInfo>();
  const nav = useNavigate();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const vid = param.id;
    const heartbeatSendTime = 7000;
    let fn: () => void;
    let postProgress: () => void;
    let postFirstHeartbeat: () => void;
    let getAllDanmaku: () => void;

    getVideoInfo(vid).then((res) => {
      const index = `P${p ?? 1}`;
      if (res === null || !res.pagination || res.pagination.length === 0) {
        nav('/404', { replace: true });
      }
      const id = res.pagination.find((item) => item.index === index)?.videoId;
      if (!id) {
        nav('/404', { replace: true });
      }
      setItem(res);
      fn = () => {
        getLastWatchedProgress(id).then((res) => {
          if (res > 0 && videoRef.current) {
            videoRef.current.currentTime = res;
            showMessage({
              children: `上次观看到${new Date(res * 1000).toISOString().slice(11, 8)}，已为您自动跳转`,
            });
          }
        });
      };

      postProgress = () => {
        clearInterval(timer.current);
        timer.current = setInterval(() => {
          const currentTime = videoRef.current?.currentTime;
          postWatchProgress(id, currentTime).then(undefined);
        }, heartbeatSendTime);
      };

      postFirstHeartbeat = () => {
        setTimeout(() => {
          postWatchCount(id).then(undefined);
        }, 1000);
      };

      getAllDanmaku = () => {
        const i = Math.ceil(videoRef.current.duration / 60 / 6);
        for (let j = 2; j <= i; j++) {
          getDanmaku(id, j).then((res) => {
            setDanmakus((prev) => prev.concat(res));
          });
        }
      };

      videoRef.current?.addEventListener('play', fn, { once: true });
      videoRef.current?.addEventListener('play', postProgress);
      videoRef.current?.addEventListener('play', postFirstHeartbeat, { once: true });
      videoRef.current?.addEventListener('loadedmetadata', getAllDanmaku, { once: true });

      getVideoUrl(id).then((res) => {
        setUrl(res);
      });

      getDanmaku(id, 1).then((res) => {
        setDanmakus(res);
      });
    });

    return () => {
      videoRef.current?.removeEventListener('play', fn);
      videoRef.current?.removeEventListener('play', postProgress);
      videoRef.current?.removeEventListener('play', postFirstHeartbeat);
      videoRef.current?.removeEventListener('loadedmetadata', getAllDanmaku);
      clearInterval(timer.current);
    };
  }, [p, param.id]);

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

  const vid = parseInt(item?.pagination.find((item) => item.index === `P${p ?? 1}`)?.videoId, 10) || 0;
  return (
    <div className='moe-video-video-page-root'>
      <Header />
      {!item && <LoadingPage />}
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
              display: item ? 'block' : 'none',
            }}
            plugins={[TripleSpeedForward]}
            ref={videoRef}
            onSendDanmaku={(danmaku) => {
              if (danmaku.text.trim() === '') {
                showMessage({ children: '弹幕内容不能为空' });
                return false;
              }
              if (!isUserLoggedInSync()) {
                showMessage({ children: '请先登录' });
                return false;
              }

              addDanmaku(
                item?.pagination[parseInt(p || '1', 10) - 1].videoId,
                danmaku.begin,
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
        {item && <VideoPageComment key={10000 + vid} videoId={param.id} />}
        {item && <VideoPaginationList key={20000 + vid} items={item.pagination} activeIndex={parseInt(p || '1', 10)} />}
        {item && <VideoRecommendList key={30000 + vid} items={item.recommendList} />}
      </div>
      <Footer />
    </div>
  );
});

export default Video;
