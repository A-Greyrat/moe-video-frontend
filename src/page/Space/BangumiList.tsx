import { memo, useEffect, useRef, useState } from 'react';
import './BangumiList.less';
import { Button, Image, Pagination } from '@natsume_shiki/mika-ui';
import { useTitle } from '../../common/hooks';
import { getBangumiFavoriteList } from '../../common/video';
import {useNavigate} from "react-router-dom";

export interface BangumiListItemProps {
  id: string;
  title: string;
  cover: string;
  desc: string;
  url: string;
  lastWatchedIndex: number;
  lastWatchedTitle: string;
}

export const BangumiListItem = memo((props: BangumiListItemProps) => {
  const { title, cover, desc, url, lastWatchedTitle, lastWatchedIndex } = props;
  const navigate = useNavigate();

  return (
    <div className='moe-video-space-page-bangumi-list-item flex py-4 px-2'>
      <a href={url} className='moe-video-space-page-bangumi-list-item-cover mr-4 overflow-hidden'>
        <Image lazy width='100%' style={{ aspectRatio: '3 / 4', objectFit: 'cover' }} src={cover} />
      </a>
      <div className='flex flex-col justify-between overflow-hidden'>
        <div>
          <div className='moe-video-space-page-bangumi-list-item-title pb-1 line-clamp-1'>{title}</div>
          <div className='text-gray-400 text-xs line-clamp-1 mb-1'>
            看到第{lastWatchedIndex}集 {lastWatchedTitle}
          </div>
          <div className='text-sm text-gray-550 line-clamp-5 whitespace-break-spaces pt-1 mb-2'>{desc}</div>
        </div>

        <div className='flex gap-2 mt-1'>
          <Button
            size='large'
            styleType='primary'
            style={{
              width: 'fit-content',
              fontSize: '1rem',
            }}
            onClick={() => {
              navigate(`${url}`);
            }}
          >
            立即观看
          </Button>
          <Button
            size='large'
            styleType='default'
            style={{
              fontSize: '1rem',
              width: 'fit-content',
            }}
          >
            取消追番
          </Button>
        </div>
      </div>
    </div>
  );
});

const BangumiList = memo(() => {
  useTitle('追番');
  const [bangumiList, setBangumiList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useRef(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getBangumiFavoriteList(currentPage, pageSize.current).then((res) => {
      setBangumiList(res.items);
      setTotal(res.total);
    });
  }, [currentPage]);

  if (total === 0) {
    return (
      <div className='moe-video-space-page-history-list flex flex-col gap-4'>
        <div className='text-center text-gray-400'>暂无追番</div>
      </div>
    );
  }

  return (
    <div>
      {bangumiList.length > 0 && (
        <div className='moe-video-space-page-bangumi-list gap-4'>
          {bangumiList.map((item, index) => (
            <BangumiListItem key={index} {...item} />
          ))}
        </div>
      )}
      <Pagination
        pageNum={Math.ceil(total / pageSize.current)}
        onChange={(index) => {
          setCurrentPage(index);
        }}
        style={{
          width: 'fit-content',
          margin: '1rem auto',
        }}
      />
    </div>
  );
});

export default BangumiList;
