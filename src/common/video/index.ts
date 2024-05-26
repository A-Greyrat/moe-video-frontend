import { DanmakuAttr } from 'mika-video-player';
import { VideoPaginationListItemProps } from '../../page/Video/VideoPaginationList.tsx';
import { VideoRecommendListItemProps } from '../../page/Video/VideoRecommendList.tsx';
import { httpGet, httpPost } from '../axios';
import { RecommendListItemProps } from '../../page/Home/RecommendList.tsx';
import { BangumiCarouselItemProps } from '../../page/Home/BangumiCarousel.tsx';
import { BangumiItemProps, VideoItemProps } from '../../page/Search/SearchList.tsx';
import { HistoryListItemProps } from '../../page/Space/HistoryList.tsx';
import { FavorListItemProps } from '../../page/Space/FavorList.tsx';
import { VideoGroupInfoList } from './type.ts';
import { IndexListItemProps } from '../../page/Home/IndexList.tsx';
import { isUserLoggedInSync } from '../user';

const proxyImg = (url: string) =>
  `https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pUrl=${encodeURIComponent(url)}`;

const proxyUrl = (url: string) => {
  // eslint-disable-next-line camelcase
  const proxy_url = 'https://b.erisu.moe/api/proxy?x-User-Agent=Android&x-Referer=https://www.bilibili.com&x-Host=';
  const host = url.split('/')[2];
  // eslint-disable-next-line camelcase
  return `${proxy_url + host}&url=${encodeURIComponent(url)}`;
};

/* Video Comment */

export type VideoPageCommentReplyItem = {
  parent?: string;

  id: string;
  time: string;
  content: string;
  replyTo: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};

export type VideoPageCommentProps = {
  id: string;
  time: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  reply: VideoPageCommentReplyItem[];
};

export interface Comment {
  id: number;
  userDetail: {
    id: number;
    nickname: string;
    avatar: string;
  };
  toId: number;
  toUserDetail: {
    id: number;
    nickname: string;
    avatar: string;
  } | null;
  content: string;
  timestamp: string;
}

export const deleteComment = async (id: string) => httpPost('/video/comment/delete', { id });

export const getComments_v1 = async (videoId: string, p: number, size: number) => {
  const url = proxyUrl(`https://api.bilibili.com/x/v2/reply?type=1&oid=${videoId}&pn=${p}&ps=${size}`);
  const data = await (await fetch(url)).json();
  const total = data.data.page.count;
  const records = data.data.replies.map((item: any) => ({
    id: item.rpid_str,
    time: new Date(item.ctime * 1000).toLocaleString(),
    content: item.content.message,
    user: {
      id: item.mid,
      name: item.member.uname,
      avatar: proxyImg(item.member.avatar),
    },
    reply: item.replies.map((reply: any) => ({
      id: reply.rpid_str,
      time: new Date(reply.ctime * 1000).toLocaleString(),
      content: reply.content.message,
      replyTo: {
        id: reply.parent_str,
        name: reply.member.uname,
      },
      user: {
        id: reply.mid,
        name: reply.member.uname,
        avatar: proxyImg(reply.member.avatar),
      },
    })),
  }));

  return {
    total,
    records,
  };
};

export const getComments_v2 = async (videoId: string, p: number, size: number) =>
  httpGet(`/video/comment?videoId=${videoId}&page=${p}&pageSize=${size}`).then((res) => {
    const data = res.data as { total: number; records: Comment[][] };
    const ret: VideoPageCommentProps[] = [];
    data?.records?.forEach((item) => {
      const father: VideoPageCommentProps = {
        id: item[0].id.toString(),
        time: item[0].timestamp.replace(/-/g, '/').replace('T', ' ').replace(/\.\d+/, ''),
        content: item[0].content,
        user: {
          id: item[0].userDetail.id.toString(),
          name: item[0].userDetail.nickname,
          avatar: item[0].userDetail.avatar,
        },
        reply: [],
      };
      ret.push(father);
      item?.slice(1).forEach((reply) => {
        father.reply?.push({
          id: reply.id.toString(),
          time: reply.timestamp.replace(/-/g, '/').replace('T', ' ').replace(/\.\d+/, ''),
          content: reply.content,
          replyTo: {
            id: reply.toUserDetail?.id.toString() || '0',
            name: reply.toUserDetail?.nickname || '我',
          },
          user: {
            id: reply.userDetail.id.toString(),
            name: reply.userDetail.nickname,
            avatar: reply.userDetail.avatar,
          },
        });
      });
    });

    return {
      total: data.total,
      records: ret,
    };
  });

export const getComments = async (videoId: string, p: number, size: number) => getComments_v2(videoId, p, size);

export const addComment = async (videoId: string, toId: string, content: string) =>
  httpPost('/video/comment/add', {
    videoId,
    toId,
    content,
  });

/* Video Info */
export interface VideoInfo {
  title: string;
  tags: string[];
  playCount: number;
  likeCount: number;
  danmakuCount: number;
  favoriteCount: number;
  description: string;
  pagination: VideoPaginationListItemProps[];
  recommendList: VideoRecommendListItemProps[];
  extra_id: string;
  isUserLiked?: boolean;
  idUserFavorite?: boolean;
}

export const getVideoInfo_v1 = async (videoId: string): Promise<VideoInfo> =>
  fetch(proxyUrl(`https://api.bilibili.com/x/web-interface/view/detail?bvid=${videoId}`))
    .then((res) => res.json())
    .then((res) => {
      const { data } = res;
      return {
        title: data.View.title,
        tags: data.Tags.map((tag: any) => tag.tag_name),
        playCount: data.View.stat.view,
        likeCount: data.View.stat.like,
        danmakuCount: data.View.stat.danmaku,
        favoriteCount: data.View.stat.favorite,
        description: data.View.desc,
        pagination: data.View.pages.map((page: any) => ({
          index: `P${page.page}`,
          title: page.part,
          url: `/video/${videoId}?p=${page.page}`,
          duration: new Date(page.duration * 1000).toISOString().substr(11, 8),
        })),
        recommendList: data.Related.map((item: any) => ({
          title: item.title,
          url: `/video/${item.bvid}`,
          cover: item.pic,
          playCount: item.stat.view > 10000 ? `${(item.stat.view / 10000).toFixed(1)}万` : item.stat.view,
          update: new Date(item.pubdate * 1000).toLocaleDateString(),
        })),
        extra_id: data.View.aid,
        isUserLiked: false,
        idUserFavorite: false,
      };
    });

export const getRelatedVideos = async (videoId: string, nums = 10): Promise<VideoRecommendListItemProps[]> =>
  httpGet<any>('/video-group/related', {
    params: {
      id: videoId,
      num: nums,
    },
  }).then((res) =>
    res?.data.map((item: any) => ({
      title: item?.title,
      cover: item?.cover,
      playCount: item?.watchCnt,
      likeCount: item?.likeCnt,
      url: `/video/${item?.id}`,
      update: new Date(item?.createTime).toLocaleDateString(),
      author: item?.uploader?.nickname || '未知用户',
    })),
  );

export const getVideoInfo_v2 = async (videoId: string): Promise<VideoInfo> => {
  const recommendList = await getRelatedVideos(videoId);

  return httpGet<any>('/video-group', {
    params: {
      id: videoId,
    },
  }).then((res) => {
    if (res.code !== 200 || !res.data) return null;
    return {
      title: res?.data?.title,
      tags: res?.data?.tags.length > 0 && res?.data?.tags.split(';'),
      playCount: res?.data?.watchCnt,
      likeCount: (res?.data?.userLike ? -1 : 0) + parseInt(res?.data?.likeCnt, 10),
      danmakuCount: res?.data?.danmakuCnt,
      favoriteCount: (res?.data.userFavorite ? -1 : 0) + parseInt(res?.data?.favoriteCnt, 10),
      description: res?.data.description,
      type: res?.data?.type,
      pagination: res?.data?.contents.map((page: any) => ({
        index: `P${page?.index}`,
        title: page?.title,
        url: `/video/${videoId}?p=${page?.index}`,
        videoId: page?.videoId,
        duration: '',
      })),
      recommendList,
      extra_id: res?.data?.bvid,
      isUserLiked: res?.data?.userLike,
      isUserFavorite: res?.data?.userFavorite,
      uploader: res?.data?.uploader,
    };
  });
};

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => getVideoInfo_v2(videoId);

export const getDanmaku_v1 = async (videoId: string, p?: string, SESSDATA?: string) =>
  fetch(`https://b.erisu.moe/api/danmaku?bvid=${videoId}&SESSDATA=${SESSDATA}${p ? `&p=${p}` : ''}`)
    .then((res) => res.json())
    .then((data) => {
      const newDanmakus: DanmakuAttr[] = [];
      if (data.error) {
        console.warn(data.error);
        return newDanmakus;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const d of data) {
        if (d.color === 0) d.color = 0xffffff;
        newDanmakus.push({
          begin: (parseFloat(d.progress) ?? 0) / 1000,
          text: d.content,
          color: `#${parseInt(d.color, 10).toString(16).padStart(6, '0')}`,
          mode: d.mode,
          size: d.fontsize,
        });
      }

      return newDanmakus;
    });

export const getDanmaku_v2 = async (videoId: string, segmentIndex?: number): Promise<DanmakuAttr[]> =>
  httpGet<DanmakuAttr[]>('/video/danmaku', {
    params: { videoId, segmentIndex },
  }).then((res) => {
    if (res.code !== 200) {
      console.warn(res.msg);
      return [];
    }

    return res.data;
  });

export const getDanmaku = async (videoId: string, segmentIndex?: number) => getDanmaku_v2(videoId, segmentIndex);
// return getDanmaku_v2(videoId, p, SESSDATA);

export const getVideoUrl_v1 = async (videoId: string, p?: string, extra?: string) => {
  const video_proxy_url = 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pHost=';
  return fetch(`https://b.erisu.moe/api/playurl/flv?bvid=${videoId}&SESSDATA=${extra}${p ? `&p=${p}` : ''}`)
    .then((res) => res.json())
    .then((data) => {
      const host = data.data.durl[0].url.split('/')[2];
      return `${video_proxy_url + host}&pUrl=${encodeURIComponent(data.data.durl[0].url)}`;
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getVideoUrl_v2 = async (videoId: string, p?: string, extra?: string) =>
  httpGet<any>('/video', {
    params: { id: videoId },
  }).then((res) => ({
    srcs: res.data?.src?.reverse().map((item: any) => ({
      url: item.src,
      type: item.srcName,
    })),
    default: 0,
  }));

export const getVideoUrl = async (videoId: string, p?: string, extra?: string) => getVideoUrl_v2(videoId, p, extra);

/* Video Upload */
export interface VideoUploadInfo {
  title: string;
  description: string;
  cover: string;
  link: string;
  tags: string;
}

export const uploadVideo = async (info: VideoUploadInfo) => {
  const url = '/plain-video-group/add';
  return httpPost(url, info);
};

/* Video Recommend */

export const getCarouselList = async (): Promise<BangumiCarouselItemProps[]> =>
  httpGet<any>('/video-group/carousel').then((res) =>
    res.data.map((item: any) => ({
      title: item.title,
      cover: item.cover,
      desc: item.description,
      url: `/video/${item.id}`,
    })),
  );

export const getRecommendList = async (num: number = 10): Promise<RecommendListItemProps[]> =>
  httpGet<any>('/video-group/recommend', { params: { num } }).then((res) =>
    res.data.map((item: any) => {
      if (item.type === 1) {
        return {
          type: 'bangumi',
          data: {
            title: item.title,
            cover: item.cover,
            url: `/video/${item.id}`,
            playCount: item.watchCnt,
            likeCount: item.likeCnt,
            lastUpdate: {
              updateTo: item.updateAtAnnouncement,
              updateAt: new Date(item.releaseTime).toLocaleDateString(),
            },
          },
        };
      }
      return {
        type: 'video',
        data: {
          title: item.title,
          cover: item.cover,
          url: `/video/${item.id}`,
          playCount: item.watchCnt,
          likeCount: item.likeCnt,
          author: item.uploader?.nickname || '未知用户',
          uploadTime: new Date(item.createTime).toLocaleDateString(),
        },
      };
    }),
  );

/* Video Search */

export interface SearchList<T extends VideoItemProps | BangumiItemProps> {
  total: number;
  items: T[];
}

export const searchVideo = async (
  keyword: string,
  page: number,
  pageSize: number,
): Promise<SearchList<VideoItemProps>> =>
  httpGet<any>('/search', {
    params: {
      q: keyword,
      type: 0,
      page,
      pageSize,
    },
  }).then((res) => {
    const { data } = res;
    return {
      total: data.total,
      items: data.records.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover,
        playCount: item.watchCnt,
        likeCount: item.likeCnt,
        author: item.uploader?.nickname || '未知用户',
        uploadTime: new Date(item.createTime).toLocaleDateString(),
        url: `/video/${item.id}`,
      })),
    };
  });

export const searchBangumi = async (
  keyword: string,
  page: number,
  pageSize: number,
): Promise<SearchList<BangumiItemProps>> =>
  httpGet<any>('/search', {
    params: {
      q: keyword,
      type: 1,
      page,
      pageSize,
    },
  }).then((res) => {
    const { data } = res;
    return {
      total: data.total,
      items: data.records.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover,
        desc: item.description,
        score: item.score,
        tags: item?.tags?.length > 0 && item.tags.split(';'),
        userFavorite: item.userFavorite,
        url: `/video/${item.id}`,
      })),
    };
  });

export const likeVideoGroup = async (id: string, status: boolean) =>
  httpPost('/video-group/like', {
    id,
    status: status ? 1 : 0,
  });

export const favoriteVideoGroup = async (id: string) => httpPost('/plain-user/favorites/add', { videoGroupId: id });

export const removeFavoriteVideoGroup = async (ids: string[]) =>
  httpPost('/plain-user/favorites/delete', { videoGroupIds: ids });

export interface HistoryList {
  total: number;
  items: HistoryListItemProps[];
}

export const getHistoryList = async (index: number, pageSize: number): Promise<HistoryList> =>
  httpGet<any>('/plain-user/history', {
    params: {
      index,
      pageSize,
    },
  }).then((res) => {
    const { data } = res;
    return {
      total: data.total,
      items: data.records.map((item: any) => ({
        type: item.videoGroupType ? 'bangumi' : 'video',
        videoGroupId: item.videoGroupId,
        title: item.videoGroupTitle,
        cover: item.videoGroupCover,
        videoTitle: item.videoTitle,
        lastWatchedTime: new Date(item.timestamp).toLocaleString(),
        index: item.videoIndex,
        author: item.uploader?.nickname || '未知用户',
        url: `/video/${item.videoGroupId}`,
      })),
    };
  });

export const deleteHistory = async (ids: string[]) => httpPost('/plain-user/history/delete', { videoGroupIds: ids });

export const postWatchProgress = async (videoId: string, progress: number) => {
  if (!isUserLoggedInSync()) return Promise.resolve();

  return httpPost('/statistic/video-play', {
    videoId,
    watchProgress: Math.floor(progress),
  });
};

export const postWatchCount = async (videoId: string) => httpPost('/statistic/video-play-start', {
    videoId
  });

export const getLastWatchedIndex = async (id: string) =>
  httpGet<any>('/plain-user/history/video-group', { params: { videoGroupId: id } }).then((res) =>
    res.code !== 200 ? '1' : res.data?.videoIndex || '1',
  );

export const getLastWatchedProgress = async (videoId: string) =>
  httpGet<any>('/plain-user/history/video-last-watch-time', { params: { videoId } }).then((res) => res.data);

export interface videoFavoriteList {
  total: number;
  items: FavorListItemProps[];
}

export const getVideoFavoriteList = async (page: number, pageSize: number): Promise<videoFavoriteList> =>
  httpGet<any>('/plain-user/favorites', {
    params: {
      type: 0,
      page,
      pageSize,
    },
  }).then((res) => {
    const { data } = res;

    return {
      total: data.total,
      items: data.records.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover,
        url: `/video/${item.id}`,
      })),
    };
  });

export const deleteVideoFavorite = async (ids: string[]) =>
  httpPost('/plain-user/favorites/delete', { videoGroupIds: ids });

export const getBangumiFavoriteList = async (page: number, pageSize: number) =>
  httpGet<any>('/plain-user/favorites', {
    params: {
      type: 1,
      page,
      pageSize,
    },
  }).then((res) => {
    const { data } = res;

    if (!data || !data.records) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: data?.total || 0,
      items: data?.records.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover,
        desc: item.description,
        url: `/video/${item.id}`,
        lastWatchedIndex: item.lastWatchVideoIndex,
        lastWatchedTitle: item.lastWatchVideoTitle,
      })),
    };
  });

export const deleteBangumiFavorite = async (ids: string[]) =>
  httpPost('/plain-user/favorites/delete', { videoGroupIds: ids });

export const getUserUploadList = async (page: number, pageSize: number) =>
  httpGet<VideoGroupInfoList>('/video-group/my-upload-list', {
    params: {
      page,
      pageSize,
    },
  }).then((res) => {
    const { data } = res;
    return {
      total: data.total,
      items: data.records.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover,
        playCount: item.watchCnt,
        uploadTime: new Date(item.createTime).toLocaleDateString(),
        url: `/video/${item.id}`,
      })),
    };
  });

export const addFeedback = async (content: string, email: string) => httpPost('/feedback/add', { content, email });

export const addReport = (type: number, targetId: string, reason: string) =>
  httpPost('/report/add', {
    type,
    targetId,
    reason,
  });

export const isFavoriteBangumi = async (id: number) =>
  httpGet('/plain-user/favorites/contains', {
    params: { videoGroupId: id },
  }).then((res) => res.data);

export const addDanmaku = async (
  videoId: string,
  begin: number,
  mode: number,
  size: number,
  color: string,
  pool: number,
  text: string,
) =>
  httpPost('/video/danmaku/add', {
    videoId,
    begin,
    mode,
    size,
    color,
    pool,
    text,
  });

export const searchSuggest = async (keyword: string, num: number = 10) =>
  httpGet<any>('/search/suggestion', {
    params: {
      q: keyword,
      num,
    },
  }).then((res) => res.data);

export const getHomeIndexList = async (): Promise<IndexListItemProps[]> =>
  httpGet<any>('/video-group/hot-tags').then((res) =>
    res.data.map((item: any) => ({
      title: item.title,
      items: item.tags.map((tag: any) => ({
        tag: tag.name ? tag.name : tag,
        url: tag.type !== null && tag.type !== undefined ? `/bangumi/index/${tag.type}` : `/search/${tag}/1`,
      })),
    })),
  );

export const getBangumiIndexList = async (type: number) =>
  httpGet<any>('/video-group/bangumi-index', {
    params: {
      type,
    },
  }).then((res) =>
    res.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      status: item.status,
      watchCnt: item.watchCnt,
      favoriteCnt: item.favoriteCnt,
      url: `/video/${item.id}`,
    })),
  );

export const getNewBangumiTimeList = async (date: string) =>
  httpGet<any>('/bangumi-video-group/time-schedule', {
    params: {
      date,
    },
  }).then((res) =>
    res.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      updateTime: item.willUpdateTime,
      updateTo: item.willUpdateIndex,
      url: `/video/${item.id}`,
    })),
  );
