import {Button, Image, InfinityList, Pagination, showMessage, withLockTime} from "@natsume_shiki/mika-ui";
import {useStore} from "mika-store";
import {memo, useCallback, useRef, useState} from "react";
import {addComment, deleteComment, getComments} from "../../common/video";
import {useUser} from "../../common/user";

import './VideoPageComment.less';

type VideoPageCommentReply = {
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

type VideoPageCommentProps = {
    id: string;
    time: string;
    content: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    reply: VideoPageCommentReply[];
};

const VideoPageCommentBox = memo((props: VideoPageCommentProps & { videoId: string }) => {
    const [currentInputIndex, setCurrentInputIndex] = useStore('video-page-current-input-index', -1);
    const [replyTo, setReplyTo] = useStore('video-page-reply-to', '-1');
    const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`);
    const [total, setTotal] = useStore<number>(`video-page-comment-total`, 0);

    const userInfo = useUser();

    const _deleteComment = useCallback(async () => {
        return deleteComment(props.id).then(() => {
            showMessage({children: '删除成功'});
            setComment(comment.filter((item) => item.id !== props.id));
            setTotal(total - 1);
        }, () => {
            showMessage({children: '删除失败'});
        });
    }, [comment, props.id, setComment, setTotal, total]);

    return (
        <div className="moe-video-page-comment-box">
            <div className="moe-video-page-comment-box-container">
                <Image lazy src={props.user.avatar} style={{width: '2.2rem', height: '2.2rem'}} error="/defaultAvatar.webp"/>
                <div>
                    <h3>{props.user.name}</h3>
                    <p>{props.time}</p>
                    <div className="moe-video-page-comment-box-content">
                        <p>{props.content}</p>
                    </div>
                    <div>
                        <Button onClick={() => {
                            if (currentInputIndex === parseInt(props.id)) {
                                setCurrentInputIndex(-1);
                                setReplyTo('-1');
                            } else {
                                setCurrentInputIndex(parseInt(props.id));
                                setReplyTo(props.id);
                            }
                        }} style={{paddingLeft: 0, fontSize: '1rem'}} styleType="link">回复</Button>
                        {userInfo?.userId.toString() === props.user.id &&
                            <Button styleType="link" onClick={_deleteComment}>删除</Button>}
                    </div>
                    <VideoPageCommentReplyBox reply={props.reply} id={props.id}/>
                </div>

            </div>
            {currentInputIndex === parseInt(props.id) && <VideoPageCommentInput vid={props.videoId} toId={replyTo}/>}
        </div>
    );
});

const VideoPageCommentReply = (props: VideoPageCommentReply) => {
    const [currentInputIndex, setCurrentInputIndex] = useStore('video-page-current-input-index', -1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_replyTo, setReplyTo] = useStore('video-page-reply-to', '-1');
    const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`);
    const [total, setTotal] = useStore<number>(`video-page-comment-total`, 0);

    const userInfo = useUser();
    const _deleteComment = useCallback(async () => {
        return deleteComment(props.id).then(() => {
            showMessage({children: '删除成功'});
            if (props.parent != null && props.parent !== '-1') {
                const item = findCommentItem(comment, props.parent);
                if (item) {
                    item.parent.reply = item.parent.reply.filter((item) => item.id !== props.id);
                    setComment([...comment]);
                    setTotal(total - 1);
                }
            }
        }, () => {
            showMessage({children: '删除失败'});
        });
    }, [comment, props.id, props.parent, setComment, setTotal, total]);

    return (
        <div className="moe-video-page-comment-box reply">
            <div className="moe-video-page-comment-box-container">
                <Image src={props.user.avatar} style={{width: '2rem', height: '2rem'}} error="/defaultAvatar.webp"/>
                <div>
                    <h3>{props.user.name}</h3>
                    <p>{props.time}</p>
                    <div className="moe-video-page-comment-box-content">
                        <p>回复<span>@{props.replyTo.name}</span>: {props.content}</p>
                    </div>
                    <div>
                        <Button onClick={() => {
                            if (currentInputIndex === parseInt(props.parent as string)) {
                                setCurrentInputIndex(-1);
                                setReplyTo('-1');
                            } else {
                                setCurrentInputIndex(parseInt(props.parent as string));
                                setReplyTo(props.id);
                            }
                        }} style={{paddingLeft: 0, fontSize: '1rem'}} styleType="link">回复</Button>
                        {userInfo?.userId.toString() === props.user.id &&
                            <Button styleType="link" onClick={_deleteComment}>删除</Button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoPageCommentReplyBox = (props: { reply?: VideoPageCommentReply[], id: string }) => {
    const [activePage, setActivePage] = useState(1);
    if (!props.reply) {
        return null;
    }

    return (
        <div className="moe-video-page-comment-reply-box">
            {props.reply.slice((activePage - 1) * 5, activePage * 5).map((reply, _index) => {
                return (
                    <VideoPageCommentReply key={reply.id} {...reply} parent={props.id}/>
                )
            })}
            {props.reply && props.reply.length > 5 &&
                <Pagination style={{
                    width: "fit-content",
                }} onChange={(page) => setActivePage(page)} pageNum={Math.ceil(props.reply.length / 5)}/>}
        </div>
    );
};

const findCommentItem = (comment: VideoPageCommentProps[], toId: string) => {
    for (let i = 0; i < comment.length; i++) {
        if (comment[i].id === toId) {
            return {
                parent: comment[i],
                toUserId: comment[i].user.id,
                toUserName: comment[i].user.name,
            }
        }
        for (let j = 0; j < comment[i].reply?.length; j++) {
            if (comment[i].reply![j].id === toId) {
                return {
                    parent: comment[i],
                    toUserId: comment[i].reply![j].user.id,
                    toUserName: comment[i].reply![j].user.name,
                };
            }
        }
    }
    return undefined;
};

const VideoPageCommentInput = memo((props: {
    toId: string,
    vid: string,
}) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`);
    const [_replyTo, setReplyTo] = useStore('video-page-reply-to', '-1');
    const [_currentInputIndex, setCurrentInputIndex] = useStore('video-page-current-input-index', -1);
    const userInfo = useUser();
    const reply = useCallback(async () => {
        const content = ref.current?.value;
        if (!content) return;
        ref.current!.value = '';
        ref.current!.blur();

        return addComment(props.vid, props.toId, content).then((_res) => {
            // if (res.code === 401) {
            //     showMessage({children: '请先登录'});
            //     return;
            // }
            //
            // if (res.code !== 200) {
            //     showMessage({children: '评论失败'});
            //     return;
            // }
            //
            // if (props.toId !== '-1') {
            //     const item = findCommentItem(comment, props.toId);
            //     item?.parent.reply.push({
            //         id: (res.data as number).toString(),
            //         time: new Date().toLocaleString(),
            //         content: content,
            //         replyTo: {
            //             id: item.toUserId,
            //             name: item.toUserName
            //         },
            //         user: {
            //             id: userInfo?.userId.toString() || '0',
            //             name: userInfo?.nickname || '我',
            //             avatar: userInfo?.avatar || '/defaultAvatar.webp'
            //         }
            //     });
            //     setComment([...comment]);
            // } else {
            //     setComment([...comment, {
            //         id: (res.data as number).toString(),
            //         time: new Date().toLocaleString(),
            //         content: content,
            //         user: {
            //             id: userInfo?.userId.toString() || '0',
            //             name: userInfo?.nickname || '我',
            //             avatar: userInfo?.avatar || '/defaultAvatar.webp'
            //         },
            //         reply: []
            //     }]);
            // }

            setCurrentInputIndex(-1);
            setReplyTo('-1');
            showMessage({children: '评论成功'});
        }, () => {
            showMessage({children: '评论失败'});
        });
    }, [comment, props.vid, props.toId, setComment, setCurrentInputIndex, setReplyTo, userInfo?.avatar, userInfo?.nickname, userInfo?.userId]);

    return (
        <div className="moe-video-page-comment-input">
            <Image style={{width: '2.2rem', height: '2.2rem'}} src="/defaultAvatar.webp" error="/defaultAvatar.webp"/>
            <textarea placeholder="写下你的评论" ref={ref}/>
            <Button styleType="primary" onClick={reply}>评论</Button>
        </div>
    );
});

const VideoPageComment = memo(({videoId}: { videoId: string }) => {
    const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`, []);
    const [total, setTotal] = useStore<number>(`video-page-comment-total`, 10);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getCommentList = useCallback(withLockTime((unloading: () => unknown) => {
        const curPage = comment ? Math.floor(comment.length / 10) + 1 : 1;

        if (total !== 0 && comment && comment.length >= total) {
            unloading();
            return;
        }
        getComments(videoId!, curPage, 10).then(async (res) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (res && res.records.length > 0) {
                const newComment = comment ? comment.concat(res.records) : res.records;
                const map = new Map();
                newComment.forEach((item) => {
                    map.set(item.id, item);
                });
                setComment([...map.values()]);
            }
            res && setTotal(res.total);
            unloading();
        });

    }, 500), [comment, videoId, total]);

    return (
        <div className="moe-video-page-video-comment">
            <h2>评论</h2>
            <div>
                <VideoPageCommentInput vid={videoId} toId={'-1'}/>
                <InfinityList className="moe-video-page-comment-infinity-list"
                              onIntersect={getCommentList} limit={total} itemNum={comment ? comment.length : 0}>
                    {comment?.map((comment, _index) => {
                        return (
                            <VideoPageCommentBox key={comment.id} videoId={videoId} {...comment}/>
                        )
                    })}
                </InfinityList>

                <div style={{
                    textAlign: "center",
                    display: total === comment?.length ? "block" : "none",
                    padding: "10px 0",
                    color: "#999",
                    userSelect: "none"
                }}>
                    没有更多了
                </div>
            </div>
        </div>
    )
});

export default VideoPageComment;
