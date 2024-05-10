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

export interface VideoPageCommentProps {
    id: string;
    time: string;
    content: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    reply: VideoPageCommentReply[];
}

const proxy_url = 'https://b.erisu.moe/api/proxy?x-User-Agent=Android&x-Referer=https://www.bilibili.com&x-Host=';
const getCover = (url: string) => {
    const host = url.split('/')[2];
    return 'https://api.erisu.moe/proxy?pReferer=https://www.bilibili.com&pHost=' + host + '&pUrl=' + encodeURIComponent(url);
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
