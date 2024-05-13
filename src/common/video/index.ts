import {DanmakuAttr} from "mika-video-player";
import {VideoPaginationListItemProps} from "../../page/Video/VideoPaginationList.tsx";
import {VideoRecommendListItemProps} from "../../page/Video/VideoRecommendList.tsx";
import {httpPost} from "../axios";

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

const proxy_url = 'https://b.erisu.moe/api/proxy?x-User-Agent=Android&x-Referer=https://www.bilibili.com&x-Host=';
const getCover = (url: string) => {
    const host = url.split('/')[2];
    return 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pUrl=' + encodeURIComponent(url);
}

const getURL = (url: string) => {
    const host = url.split('/')[2];
    return proxy_url + host + '&url=' + encodeURIComponent(url);
};


export const getComments = async (videoId: string, p: number, size: number) => {

    const url = getURL('https://api.bilibili.com/x/v2/reply?type=1&oid=' + videoId + '&pn=' + p + '&ps=' + size);
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
                avatar: getCover(item.member.avatar)
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
                        avatar: getCover(reply.member.avatar)
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

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
    return fetch(getURL('https://api.bilibili.com/x/web-interface/view/detail?bvid=' + videoId))
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

export const getDanmaku = async (videoId: string, p?: string, SESSDATA?: string) => {
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

export const getVideoURL = async (videoId: string, p?: string, SESSDATA?: string) => {
    const video_proxy_url = 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pHost=';
    return fetch('https://b.erisu.moe/api/playurl/flv?bvid=' + videoId + '&SESSDATA=' + SESSDATA + (p ? '&p=' + p : '')).then(res => res.json()).then(data => {
        const host = data.data.durl[0].url.split('/')[2];
        return video_proxy_url + host + '&pUrl=' + encodeURIComponent(data.data.durl[0].url);
    });
};

// https://api.bilibili.com/x/web-interface/search/type

const getSearchResult = async (keyword: string, p: number, size: number) => {
    const url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=' + keyword + '&page=' + p + '&pagesize=' + size;
    const proxy = 'https://b.erisu.moe/api/proxy?x-Cookie=&x-Host=api.bilibili.com' + '&url=' + encodeURIComponent(url);

    return fetch(proxy, {
        headers: {
            Cookie: 'SESSDATA=; bili_jct=',
        }
    })
        .then(res => res.json()).then(data => {
            return data;
        });
};

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
