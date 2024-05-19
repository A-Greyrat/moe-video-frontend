import React, { memo } from 'react';

import './index.less';

export interface SkeletonCardProps {
  num?: number;
  style?: React.CSSProperties;
  type?: 'box' | 'strip';
}

const SkeletonCard = memo((props: SkeletonCardProps) => {
  const { num = 1, style, type = 'box' } = props;

  if (type === 'box') {
    return (
      <div style={{ ...style }}>
        {Array.from({ length: num }).map((_, index) => (
          <div className='moe-video-skeleton-card' key={index}>
            <div className='moe-video-skeleton-card-cover'></div>
            <div className='moe-video-skeleton-card-title'></div>
            <div className='moe-video-skeleton-card-info'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ ...style }}>
      {Array.from({ length: num }).map((_, index) => (
        <div className='moe-video-skeleton-strip-card' key={index}>
          <div className='moe-video-skeleton-strip-card-content'></div>
        </div>
      ))}
    </div>
  );
});

export default SkeletonCard;
