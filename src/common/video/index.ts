import {DanmakuAttr} from "mika-video-player";
import {VideoPaginationListItemProps} from "../../page/Video/VideoPaginationList.tsx";
import {VideoRecommendListItemProps} from "../../page/Video/VideoRecommendList.tsx";
import {httpGet, httpPost} from "../axios";
import {RecommendListItemProps} from "../../page/Home/RecommendList.tsx";
import {BangumiCarouselItemProps} from "../../page/Home/BangumiCarousel.tsx";
import {BangumiItemProps, VideoItemProps} from "../../page/Search/SearchList.tsx";

const proxyImg = (url: string) => {
    return 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pUrl=' + encodeURIComponent(url);
}

const proxyUrl = (url: string) => {
    const proxy_url = 'https://b.erisu.moe/api/proxy?x-User-Agent=Android&x-Referer=https://www.bilibili.com&x-Host=';
    const host = url.split('/')[2];
    return proxy_url + host + '&url=' + encodeURIComponent(url);
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
    }
    user: {
        id: string;
        name: string;
        avatar: string;
    }
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

export const deleteComment = async (id: string) => {
    return httpPost("/video/comment/delete", {id});
};

export const getComments_v1 = async (videoId: string, p: number, size: number) => {
    const url = proxyUrl('https://api.bilibili.com/x/v2/reply?type=1&oid=' + videoId + '&pn=' + p + '&ps=' + size);
    const data = await (await fetch(url)).json();
    const total = data.data.page.count;
    const records = data.data.replies.map((item: any) => {
        return {
            id: item.rpid_str,
            time: new Date(item.ctime * 1000).toLocaleString(),
            content: item.content.message,
            user: {
                id: item.mid,
                name: item.member.uname,
                avatar: proxyImg(item.member.avatar)
            },
            reply: item.replies.map((reply: any) => {
                return {
                    id: reply.rpid_str,
                    time: new Date(reply.ctime * 1000).toLocaleString(),
                    content: reply.content.message,
                    replyTo: {
                        id: reply.parent_str,
                        name: reply.member.uname
                    },
                    user: {
                        id: reply.mid,
                        name: reply.member.uname,
                        avatar: proxyImg(reply.member.avatar)
                    }
                };
            })
        };
    });

    return {
        total,
        records
    };
}

export const getComments_v2 = async (videoId: string, p: number, size: number) => {
    return httpGet(`/video/comment?videoId=${videoId}&page=${p}&pageSize=${size}`).then((res) => {
        const data = res.data as { total: number, records: Comment[][] };
        const ret: VideoPageCommentProps[] = [];
        data?.records?.forEach((item) => {
            const father: VideoPageCommentProps = {
                id: item[0].id.toString(),
                time: item[0].timestamp.replace(/-/g, "/").replace("T", " ").replace(/\.\d+/, ""),
                content: item[0].content,
                user: {
                    id: item[0].userDetail.id.toString(),
                    name: item[0].userDetail.nickname,
                    avatar: item[0].userDetail.avatar
                },
                reply: []
            }
            ret.push(father);
            item?.slice(1).forEach((reply) => {
                father.reply?.push({
                    id: reply.id.toString(),
                    time: reply.timestamp.replace(/-/g, "/").replace("T", " ").replace(/\.\d+/, ""),
                    content: reply.content,
                    replyTo: {
                        id: reply.toUserDetail?.id.toString() || "0",
                        name: reply.toUserDetail?.nickname || "我"
                    },
                    user: {
                        id: reply.userDetail.id.toString(),
                        name: reply.userDetail.nickname,
                        avatar: reply.userDetail.avatar
                    }
                });
            });
        });

        return {
            total: data.total,
            records: ret
        };
    });
};

export const getComments = async (videoId: string, p: number, size: number) => {
    return getComments_v2(videoId, p, size);
};

export const addComment = async (videoId: string, toId: string, content: string) => {
    return httpPost("/video/comment/add", {
        videoId: videoId,
        toId: toId,
        content: content
    });
};

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
}

export const getVideoInfo_v1 = async (videoId: string): Promise<VideoInfo> => {
    return fetch(proxyUrl('https://api.bilibili.com/x/web-interface/view/detail?bvid=' + videoId))
        .then(res => res.json())
        .then(res => {
            const data = res.data;
            return {
                title: data.View.title,
                tags: data.Tags.map((tag: any) => tag.tag_name),
                playCount: data.View.stat.view,
                likeCount: data.View.stat.like,
                danmakuCount: data.View.stat.danmaku,
                favoriteCount: data.View.stat.favorite,
                description: data.View.desc,
                pagination: data.View.pages.map((page: any) => {
                    return {
                        index: 'P' + page.page,
                        title: page.part,
                        url: '/video/' + videoId + '?p=' + page.page,
                        duration: new Date(page.duration * 1000).toISOString().substr(11, 8),
                    };
                }),
                recommendList: data.Related.map((item: any) => {
                    return {
                        title: item.title,
                        url: '/video/' + item.bvid,
                        cover: item.pic,
                        playCount: item.stat.view > 10000 ? (item.stat.view / 10000).toFixed(1) + '万' : item.stat.view,
                        update: new Date(item.pubdate * 1000).toLocaleDateString(),
                    }
                }),
                extra_id: data.View.aid,
            };
        });
};


export const getRelatedVideos = async (videoId: string, nums = 10): Promise<VideoRecommendListItemProps[]> => {
    return httpGet<any>('/video-group/related', {
        params: {
            id: videoId,
            num: nums
        }
    }).then(res => {
        return res.data.map((item: any) => {
            return {
                title: item.title,
                cover: item.cover,
                playCount: item.watchCnt,
                likeCount: item.likeCnt,
                url: '/video/' + item.id,
                update: new Date(item.createTime).toLocaleDateString(),
                author: item.uploader?.nickname || '未知用户',
            }
        });
    });
};

export const getVideoInfo_v2 = async (videoId: string): Promise<VideoInfo> => {
    const recommendList = await getRelatedVideos(videoId);

    return httpGet<any>('/video-group', {
        params: {
            id: videoId
        }
    }).then(res => {
        return {
            title: res.data.title,
            tags: res.data.tags?.map((tag: any) => tag.name),
            playCount: res.data.watchCnt,
            likeCount: res.data.likeCnt,
            danmakuCount: res.data.danmakuCnt,
            favoriteCount: res.data.favoriteCnt,
            description: res.data.description,
            pagination: res.data.contents.map((page: any) => {
                return {
                    index: 'P' + page.index,
                    title: page.title,
                    url: '/video/' + videoId + '?p=' + page.index,
                    videoId: page.videoId,
                    duration: '',
                };
            }),
            recommendList: recommendList,
            extra_id: res.data.bvid,
        }
    });
}

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
    return getVideoInfo_v2(videoId);
};

export const getDanmaku_v1 = async (videoId: string, p?: string, SESSDATA?: string) => {
    return fetch('https://b.erisu.moe/api/danmaku?bvid=' + videoId + '&SESSDATA=' + SESSDATA + (p ? '&p=' + p : '')).then(res => res.json()).then(data => {
        const newDanmakus: DanmakuAttr[] = [];
        if (data.error) {
            console.warn(data.error);
            return newDanmakus;
        }

        for (const d of data) {
            if (d.color === 0) d.color = 0xffffff;
            newDanmakus.push({
                begin: (parseFloat(d.progress) ?? 0) / 1000,
                text: d.content,
                color: '#' + parseInt(d.color).toString(16).padStart(6, '0'),
                mode: d.mode,
                size: d.fontsize,
            });
        }

        return newDanmakus;
    });
};

export const getDanmaku_v2 = async (videoId: string, p?: string, SESSDATA?: string): Promise<DanmakuAttr> => {
    return httpGet<DanmakuAttr>('/video/danmaku', {
        params: {id: videoId}
    }).then(res => res.data);
}

export const getDanmaku = async (videoId: string, p?: string, SESSDATA?: string) => {
    return getDanmaku_v1(videoId, p, SESSDATA);
    // return getDanmaku_v2(videoId, p, SESSDATA);
};

export const getVideoUrl_v1 = async (videoId: string, p?: string, extra?: string) => {
    const video_proxy_url = 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pHost=';
    return fetch('https://b.erisu.moe/api/playurl/flv?bvid=' + videoId + '&SESSDATA=' + extra + (p ? '&p=' + p : '')).then(res => res.json()).then(data => {
        const host = data.data.durl[0].url.split('/')[2];
        return video_proxy_url + host + '&pUrl=' + encodeURIComponent(data.data.durl[0].url);
    });
};

export const getVideoUrl_v2 = async (videoId: string, p?: string, extra?: string) => {
    return httpGet<any>('/video', {
        params: {id: videoId}
    }).then(res => {
        return res.data.src[0].src;
    });
};

export const getVideoUrl = async (videoId: string, p?: string, extra?: string) => {
    return getVideoUrl_v2(videoId, p, extra);
};

/* Video Upload */
export interface VideoUploadInfo {
    title: string;
    description: string;
    cover: string;
    link: string;
}

export const uploadVideo = async (info: VideoUploadInfo) => {
    const url = '/plain-video-group/add';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    info.tagIds = [1];
    return httpPost(url, info);
}


/* Video Recommend */

export const getCarouselList = async (): Promise<BangumiCarouselItemProps[]> => {
    return httpGet<any>('/video-group/carousel').then(res => {
        return res.data.map((item: any) => {
            return {
                title: item.title,
                cover: item.cover,
                desc: item.description,
                url: '/video/' + item.id,
            };
        });
    });
};

export const getRecommendList = async (num: number = 10): Promise<RecommendListItemProps[]> => {
    return httpGet<any>('/video-group/recommend', {params: {num: num}}).then(res => {
        return res.data.map((item: any) => {
            if (item.type === 1) {
                return {
                    type: 'bangumi',
                    data: {
                        title: item.title,
                        cover: item.cover,
                        url: '/video/' + item.id,
                        playCount: item.watchCnt,
                        likeCount: item.likeCnt,
                        lastUpdate: {
                            updateTo: Math.floor(Math.random() * 12),
                            updateAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
                        }
                    }
                };
            }
            return {
                type: 'video',
                data: {
                    title: item.title,
                    cover: item.cover,
                    url: '/video/' + item.id,
                    playCount: item.watchCnt,
                    likeCount: item.likeCnt,
                    author: item.uploader?.nickname || '未知用户',
                    uploadTime: new Date(item.createTime).toLocaleDateString(),
                }
            };
        });
    });
};

/* Video Search */

export interface SearchList<T extends VideoItemProps | BangumiItemProps> {
    total: number;
    items: T[];
}

export const searchVideo = async (keyword: string, page: number, pageSize: number): Promise<SearchList<VideoItemProps>> => {
    return httpGet<any>('/search', {
        params: {
            q: keyword,
            type: 0,
            page,
            pageSize
        }
    }).then(res => {
        const data = res.data;
        return {
            total: data.total,
            items: data.records.map((item: any) => {
                return {
                    title: item.title,
                    cover: item.cover,
                    playCount: item.watchCnt,
                    likeCount: item.likeCnt,
                    author: item.uploader?.nickname || '未知用户',
                    uploadTime: new Date(item.createTime).toLocaleDateString(),
                    url: '/video/' + item.id,
                }
            })
        };
    });
};

export const searchBangumi = async (keyword: string, page: number, pageSize: number): Promise<SearchList<BangumiItemProps>> => {
    return httpGet<any>('/search', {
        params: {
            q: keyword,
            type: 1,
            page,
            pageSize
        }
    }).then(res => {
        const data = res.data;
        return {
            total: data.total,
            items: data.records.map((item: any) => {
                return {
                    title: item.title,
                    cover: item.cover,
                    desc: item.description,
                    score: item.score,
                    tags: item.tags?.map((tag: any) => tag.name),
                    url: '/video/' + item.id,
                }
            })
        }
    });
};
