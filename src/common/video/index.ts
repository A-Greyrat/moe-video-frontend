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
export const deleteComment = async (_id: string) => {

};

export interface VideoPageCommentReply {
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
}

export const getComments = async (videoId: string, p: number, size: number) => {
    return {
        total: 0,
        records: []
    };

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
};

export const addComment = async (_videoId: string, _toId: string, _content: string) => {

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
    avid: string;
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
                avid: data.View.aid,
            };
        });
};

export const getVideoInfo_v2 = async (videoId: string): Promise<VideoInfo> => {
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
            danmakuCount: 0,
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
            recommendList: [],
            avid: videoId,
        }
    });
}

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
    return getVideoInfo_v2(videoId);
};

export const getDanmaku_v1 = async (videoId: string, p?: string, SESSDATA?: string) => {
    return fetch('https://b.erisu.moe/api/danmaku?bvid=' + videoId + '&SESSDATA=' + SESSDATA + (p ? '&p=' + p : '')).then(res => res.json()).then(data => {
        const newDanmakus: DanmakuAttr[] = [];
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
    // return getDanmaku_v1(videoId, p, SESSDATA);
    return getDanmaku_v2(videoId, p, SESSDATA);
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
                    uploadTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
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
    return httpGet<any>('/video-group/search', {
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
                    uploadTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
                    url: '/video/' + item.id,
                }
            })
        };
    });
};

export const searchBangumi = async (keyword: string, page: number, pageSize: number): Promise<SearchList<BangumiItemProps>> => {
    return httpGet<any>('/video-group/search', {
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
