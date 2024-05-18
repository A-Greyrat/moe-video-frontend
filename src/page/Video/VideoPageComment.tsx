import { Button, Image, InfinityList, Pagination, showMessage, withLockTime } from '@natsume_shiki/mika-ui';
import { useStore } from 'mika-store';
import { memo, useCallback, useRef, useState } from 'react';
import {
  addComment,
  deleteComment,
  getComments,
  VideoPageCommentProps,
  VideoPageCommentReplyItem,
} from '../../common/video';
import { useUser } from '../../common/user';

import './VideoPageComment.less';

const VideoPageCommentBox = memo((props: VideoPageCommentProps & { videoId: string }) => {
  const [currentInputIndex, setCurrentInputIndex] = useStore('video-page-current-input-index', -1);
  const [replyTo, setReplyTo] = useStore('video-page-reply-to', '-1');
  const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`);
  const [total, setTotal] = useStore<number>(`video-page-comment-total`, 0);

  const userInfo = useUser();

  // eslint-disable-next-line no-underscore-dangle
  const _deleteComment = useCallback(
    async () =>
      deleteComment(props.id).then(
        () => {
          showMessage({ children: '删除成功' });
          setComment(comment.filter((item) => item.id !== props.id));
          setTotal(total - 1);
        },
        () => {
          showMessage({ children: '删除失败' });
        },
      ),
    [comment, props.id, setComment, setTotal, total],
  );

  return (
    <div className='moe-video-page-comment-box'>
      <div className='moe-video-page-comment-box-container'>
        <Image lazy src={props.user.avatar} error='/defaultAvatar.webp' />
        <div>
          <h3>{props.user.name}</h3>
          <p>{props.time}</p>
          <div className='moe-video-page-comment-box-content'>
            <p>{props.content}</p>
          </div>
          <div>
            <Button
              onClick={() => {
                if (currentInputIndex === parseInt(props.id, 10)) {
                  setCurrentInputIndex(-1);
                  setReplyTo('-1');
                } else {
                  setCurrentInputIndex(parseInt(props.id, 10));
                  setReplyTo(props.id);
                }
              }}
              style={{ paddingLeft: 0, fontSize: '1rem' }}
              styleType='link'
            >
              回复
            </Button>
            {userInfo?.userId.toString() === props.user.id && (
              <Button styleType='link' onClick={_deleteComment}>
                删除
              </Button>
            )}
          </div>
          {/* eslint-disable-next-line no-use-before-define */}
          <VideoPageCommentReplyBox reply={props.reply} id={props.id} />
        </div>
      </div>
      {/* eslint-disable-next-line no-use-before-define */}
      {currentInputIndex === parseInt(props.id, 10) && <VideoPageCommentInput vid={props.videoId} toId={replyTo} />}
    </div>
  );
});

const VideoPageCommentReply = (props: VideoPageCommentReplyItem) => {
  const [currentInputIndex, setCurrentInputIndex] = useStore('video-page-current-input-index', -1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_replyTo, setReplyTo] = useStore('video-page-reply-to', '-1');
  const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`);
  const [total, setTotal] = useStore<number>(`video-page-comment-total`, 0);

  const userInfo = useUser();
  // eslint-disable-next-line no-underscore-dangle
  const _deleteComment = useCallback(
    async () =>
      deleteComment(props.id).then(
        () => {
          showMessage({ children: '删除成功' });
          if (props.parent != null && props.parent !== '-1') {
            // eslint-disable-next-line no-use-before-define
            const item = findCommentItem(comment, props.parent);
            if (item) {
              item.parent.reply = item.parent.reply.filter((item) => item.id !== props.id);
              setComment([...comment]);
              setTotal(total - 1);
            }
          }
        },
        () => {
          showMessage({ children: '删除失败' });
        },
      ),
    [comment, props.id, props.parent, setComment, setTotal, total],
  );

  return (
    <div className='moe-video-page-comment-box reply'>
      <div className='moe-video-page-comment-box-container'>
        <Image src={props.user.avatar} lazy error='/defaultAvatar.webp' />
        <div>
          <h3>{props.user.name}</h3>
          <p>{props.time}</p>
          <div className='moe-video-page-comment-box-content'>
            <p>
              回复<span>@{props.replyTo.name}</span>: {props.content}
            </p>
          </div>
          <div>
            <Button
              onClick={() => {
                if (currentInputIndex === parseInt(props.parent as string, 10)) {
                  setCurrentInputIndex(-1);
                  setReplyTo('-1');
                } else {
                  setCurrentInputIndex(parseInt(props.parent as string, 10));
                  setReplyTo(props.id);
                }
              }}
              style={{ paddingLeft: 0, fontSize: '1rem' }}
              styleType='link'
            >
              回复
            </Button>
            {userInfo?.userId.toString() === props.user.id && (
              <Button styleType='link' onClick={_deleteComment}>
                删除
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoPageCommentReplyBox = (props: { reply?: VideoPageCommentReplyItem[]; id: string }) => {
  const [activePage, setActivePage] = useState(1);
  if (!props.reply) {
    return null;
  }

  return (
    <div className='moe-video-page-comment-reply-box'>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {props.reply.slice((activePage - 1) * 5, activePage * 5).map((reply, _index) => (
        <VideoPageCommentReply key={reply.id} {...reply} parent={props.id} />
      ))}
      {props.reply && props.reply.length > 5 && (
        <Pagination
          style={{
            width: 'fit-content',
          }}
          onChange={(page) => setActivePage(page)}
          pageNum={Math.ceil(props.reply.length / 5)}
        />
      )}
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
      };
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

const VideoPageCommentInput = memo((props: { toId: string; vid: string }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_replyTo, setReplyTo] = useStore('video-page-reply-to', '-1');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentInputIndex, setCurrentInputIndex] = useStore('video-page-current-input-index', -1);
  const userInfo = useUser();
  const reply = useCallback(async () => {
    const content = ref.current?.value;
    if (!content) return;
    ref.current!.value = '';
    ref.current!.blur();

    // eslint-disable-next-line consistent-return
    return addComment(props.vid, props.toId, content).then(
      (res) => {
        if (res.code === 401) {
          showMessage({ children: '请先登录' });
          return;
        }

        if (res.code !== 200) {
          showMessage({ children: '评论失败' });
          return;
        }

        if (props.toId !== '-1') {
          const item = findCommentItem(comment, props.toId);
          item?.parent.reply.push({
            id: (res.data as number).toString(),
            time: new Date().toLocaleString(),
            content,
            replyTo: {
              id: item.toUserId,
              name: item.toUserName,
            },
            user: {
              id: userInfo?.userId.toString() || '0',
              name: userInfo?.nickname || '我',
              avatar: userInfo?.avatar || '/defaultAvatar.webp',
            },
          });
          setComment([...comment]);
        } else {
          setComment([
            ...comment,
            {
              id: (res.data as number).toString(),
              time: new Date().toLocaleString(),
              content,
              user: {
                id: userInfo?.userId.toString() || '0',
                name: userInfo?.nickname || '我',
                avatar: userInfo?.avatar || '/defaultAvatar.webp',
              },
              reply: [],
            },
          ]);
        }

        setCurrentInputIndex(-1);
        setReplyTo('-1');
        showMessage({ children: '评论成功' });
      },
      () => {
        showMessage({ children: '评论失败' });
      },
    );
  }, [
    comment,
    props.vid,
    props.toId,
    setComment,
    setCurrentInputIndex,
    setReplyTo,
    userInfo?.avatar,
    userInfo?.nickname,
    userInfo?.userId,
  ]);

  return (
    <div className='moe-video-page-comment-input'>
      <Image lazy src='/defaultAvatar.webp' error='/defaultAvatar.webp' />
      <textarea placeholder='写下你的评论' ref={ref} />
      <Button styleType='primary' onClick={reply}>
        评论
      </Button>
    </div>
  );
});

const calcItemNum = (comment: VideoPageCommentProps[]) => {
  let num = 0;
  for (let i = 0; i < comment.length; i++) {
    num += 1;
    if (comment[i].reply) {
      num += comment[i].reply.length;
    }
  }
  return num;
};

const VideoPageComment = memo(({ videoId }: { videoId: string }) => {
  const [comment, setComment] = useStore<VideoPageCommentProps[]>(`video-page-comment`, []);
  const [total, setTotal] = useStore<number>(`video-page-comment-total`, 10);

  const getCommentList = useCallback(
    withLockTime((unloading: () => unknown) => {
      const curPage = comment ? Math.floor(comment.length / 10) + 1 : 1;

      if (total !== 0 && comment && comment.length >= total) {
        unloading();
        return;
      }
      getComments(videoId!, curPage, 10).then(async (res) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
        if (res && res.records.length > 0) {
          const newComment = comment ? comment.concat(res.records) : res.records;
          const map = new Map();
          newComment.forEach((item: { id: unknown }) => {
            map.set(item.id, item);
          });
          setComment([...map.values()]);
        }
        // eslint-disable-next-line no-unused-expressions
        res && setTotal(res.total);
        unloading();
      });
    }, 500),
    [comment, videoId, total],
  );

  return (
    <div className='moe-video-page-video-comment'>
      <h2>评论</h2>
      <div>
        <VideoPageCommentInput vid={videoId} toId={'-1'} />
        <InfinityList
          className='moe-video-page-comment-infinity-list'
          onIntersect={getCommentList}
          limit={total}
          itemNum={comment ? calcItemNum(comment) : 0}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {comment?.map((comment, _index) => <VideoPageCommentBox key={comment.id} videoId={videoId} {...comment} />)}
        </InfinityList>

        <div
          style={{
            textAlign: 'center',
            display: total === (comment ? calcItemNum(comment) : 0) ? 'block' : 'none',
            padding: '10px 0',
            color: '#999',
            userSelect: 'none',
          }}
        >
          没有更多了
        </div>
      </div>
    </div>
  );
});

export default VideoPageComment;
