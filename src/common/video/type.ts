export interface VideoGroupInfo {
  title: string;
  uploader: {
    id: number;
    nickname: string;
    avatar: string;
  };
  cover: string;
  description: string;
  tags: string;
  type: number;
  watchCnt: string;
  likeCnt: string;
  favoriteCnt: string;
  commentCnt: string;
  danmakuCnt: string;
  userLike: boolean;
  userFavorite: boolean;
  createTime: string;
}

export interface VideoGroupInfoList {
  total: number;
  records: VideoGroupInfo[];
}
