import React, { memo, useCallback, useRef, useState } from 'react';
import { Image as Img, showModal } from '@natsume_shiki/mika-ui';

import './AvatarUpload.less';
import { ImageTrimmer } from '../Upload/ImageUpload.tsx';

export interface AvatarUploadProps extends React.HTMLAttributes<HTMLFormElement> {
  initAvatar?: string;
  onFileChange?: (file: File) => void;
}

const AvatarUpload = memo((props: AvatarUploadProps) => {
  const { initAvatar, onFileChange, className, ...rest } = props;
  const inputRef = React.createRef<HTMLInputElement>();
  const [src, setSrc] = useState(initAvatar);
  const canvas = useRef(OffscreenCanvas ? new OffscreenCanvas(1, 1) : document.createElement('canvas'));
  const cropPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleClick = () => {
    inputRef?.current && inputRef?.current.click();
  };

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      showModal({
        title: '图片裁剪',
        content: (
          <ImageTrimmer
            file={file}
            onCropChange={(x, y, width, height) => {
              cropPos.current = { x, y, width, height };
            }}
          />
        ),
        footer: 'ok',
        closeIcon: false,
        onOk: () => {
          // 裁剪图片
          const image = new Image();
          image.src = URL.createObjectURL(file);
          image.onload = () => {
            const ctx = canvas.current.getContext('2d');
            if (!ctx || !('drawImage' in ctx)) {
              console.warn('Canvas 2D Context is not supported');
              return;
            }

            canvas.current.width = cropPos.current.width;
            canvas.current.height = cropPos.current.height;

            ctx.drawImage(
              image,
              cropPos.current.x,
              cropPos.current.y,
              cropPos.current.width,
              cropPos.current.height,
              0,
              0,
              cropPos.current.width,
              cropPos.current.height,
            );

            if (canvas.current instanceof HTMLCanvasElement) {
              const dataUrl = canvas.current.toDataURL('image/jpeg');
              const newFile = new File([dataUrl], file.name, { type: 'image/jpeg' });
              setSrc(dataUrl);
              onFileChange?.(newFile);
            } else {
              canvas.current.convertToBlob({ type: 'image/jpeg', quality: 0.7 }).then((blob) => {
                const newFile = new File([blob], file.name, { type: 'image/jpeg' });
                setSrc(URL.createObjectURL(newFile));
                onFileChange?.(newFile);
              });
            }
          };
        },
      });
    },
    [onFileChange],
  );

  return (
    <form onClick={handleClick} className={`mika-avatar-upload${className ? ` ${className}` : ''}`} {...rest}>
      <input ref={inputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={handleFileChange} />
      <Img width='100%' style={{ aspectRatio: '1 / 1' }} src={src} />
    </form>
  );
});

export default AvatarUpload;
