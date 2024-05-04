export const deleteComment = async (id: string) => {

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

export const getComments = async (videoId: string, p: number, size: number) => {
    return {
        total: 3,
        records: [
            {
                id: "1",
                time: "2021-08-01 12:00:00",
                content: "这是一条评论",
                user: {
                    id: "1",
                    name: "用户1",
                    avatar: "/defaultAvatar.webp"
                },
                reply: [
                    {
                        id: "2",
                        time: "2021-08-01 12:00:00",
                        content: "这是一条回复",
                        replyTo: {
                            id: "1",
                            name: "用户1"
                        },
                        user: {
                            id: "2",
                            name: "用户2",
                            avatar: "/defaultAvatar.webp"
                        }
                    }
                ]
            },
            {
                id: "2",
                time: "2021-08-01 12:00:00",
                content: "这是一条评论",
                user: {
                    id: "2",
                    name: "用户2",
                    avatar: "/defaultAvatar.webp"
                },
                reply: []
            },
            {
                id: "3",
                time: "2021-08-01 12:00:00",
                content: "这是一条评论",
                user: {
                    id: "3",
                    name: "用户3",
                    avatar: "/defaultAvatar.webp"
                },
                reply: []
            }
        ]
    };
};

export const addComment = async (videoId: string, toId: string, content: string) => {

};
