import React, {memo, useCallback, useEffect, useRef, useState} from "react";

import './ImageUpload.less';
import {Button, showMessage, showModal} from "@natsume_shiki/mika-ui";

const ImageIcon = memo(() => {

    return (
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             data-spm-anchor-id="a313x.search_index.0.i2.30223a81anm0Mu" width="25" height="25">
            <path
                d="M819.2 96H204.8c-59.733333 0-108.8 49.066667-108.8 108.8v616.533333c0 59.733333 49.066667 108.8 108.8 108.8h616.533333c59.733333 0 108.8-49.066667 108.8-108.8V204.8c-2.133333-59.733333-51.2-108.8-110.933333-108.8z m44.8 723.2c0 23.466667-19.2 44.8-44.8 44.8H204.8c-23.466667 0-44.8-19.2-44.8-44.8V204.8c0-23.466667 19.2-44.8 44.8-44.8h616.533333c23.466667 0 44.8 19.2 44.8 44.8v614.4z"
                fill="#ceb7d5"></path>
            <path
                d="M298.666667 522.666667h128c29.866667 0 53.333333-23.466667 53.333333-53.333334v-128c0-29.866667-23.466667-53.333333-53.333333-53.333333h-128c-29.866667 0-53.333333 23.466667-53.333334 53.333333v128c0 29.866667 23.466667 53.333333 53.333334 53.333334z m10.666666-170.666667h106.666667v106.666667h-106.666667v-106.666667zM746.666667 437.333333h-170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h170.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM746.666667 629.333333H277.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h469.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"
                fill="#ceb7d5"></path>
        </svg>);
});

export interface ImageTrimProps {
    file: File;
    onCropChange?: (x: number, y: number, width: number, height: number) => void;
}

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
};

const ImageTrimmer = memo((props: ImageTrimProps) => {
    const movingCornerIndex = useRef(-1);
    const cropperRef = useRef<HTMLDivElement>(null);
    const moveOrigin = useRef({x: NaN, y: NaN});
    const imageNaturalSize = useRef({width: 0, height: 0});
    const originalSize = useRef({width: 0, height: 0});
    const resizeObserver = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        resizeObserver.current = new ResizeObserver(() => {
            if (originalSize.current.width === 0 || originalSize.current.height === 0) {
                originalSize.current.width = cropperRef.current?.parentElement?.offsetWidth ?? 0;
                originalSize.current.height = cropperRef.current?.parentElement?.offsetHeight ?? 0;

                return;
            }

            const parent = cropperRef.current?.parentElement;
            const parentWidth = parent?.offsetWidth;
            const parentHeight = parent?.offsetHeight;

            const scale = Math.min(parentWidth / originalSize.current.width, parentHeight / originalSize.current.height);
            originalSize.current.width = parentWidth;
            originalSize.current.height = parentHeight;

            const cropper = cropperRef.current;

            if (cropper && parentWidth && parentHeight) {
                cropper.style.width = scale * cropper.offsetWidth + 'px';
                cropper.style.height = scale * cropper.offsetHeight + 'px';
                cropper.style.left = scale * cropper.offsetLeft + 'px';
                cropper.style.top = scale * cropper.offsetTop + 'px';
            }
        });

        resizeObserver.current.observe(cropperRef.current?.parentElement as Element);

        return () => {
            resizeObserver.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        const image = new Image();
        image.src = URL.createObjectURL(props.file);
        image.onload = () => {
            imageNaturalSize.current.width = image.width;
            imageNaturalSize.current.height = image.height;

            const parent = cropperRef.current?.parentElement;
            const parentWidth = parent.offsetWidth;
            const parentHeight = parent.offsetHeight;

            const cropper = cropperRef.current;

            props.onCropChange(0, 0, cropper.offsetWidth * imageNaturalSize.current.width / parentWidth, cropper.offsetHeight * imageNaturalSize.current.height / parentHeight);
        };

        return () => {
            URL.revokeObjectURL(image.src);
        };
    }, [props]);

    const getRelativePosition = useCallback((e: React.MouseEvent<HTMLDivElement>, relativeElement: HTMLElement) => {
        const rect = relativeElement.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const handleMoveCropper = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const {x: mouseX, y: mouseY} = getRelativePosition(e, e.currentTarget);
        const parentWidth = e.currentTarget.offsetWidth;
        const parentHeight = e.currentTarget.offsetHeight;

        const cropper = cropperRef.current;

        const deltaX = Math.max(moveOrigin.current.x, Math.min(parentWidth - cropper.offsetWidth + moveOrigin.current.x, mouseX));
        const deltaY = Math.max(moveOrigin.current.y, Math.min(parentHeight - cropper.offsetHeight + moveOrigin.current.y, mouseY));

        cropper.style.left = deltaX - moveOrigin.current.x + 'px';
        cropper.style.top = deltaY - moveOrigin.current.y + 'px';

        if (props.onCropChange) {
            const x = (deltaX - moveOrigin.current.x) * imageNaturalSize.current.width / parentWidth;
            const y = (deltaY - moveOrigin.current.y) * imageNaturalSize.current.height / parentHeight;
            const natureWidth = cropper.offsetWidth * imageNaturalSize.current.width / parentWidth;
            const natureHeight = cropper.offsetHeight * imageNaturalSize.current.height / parentHeight;

            props.onCropChange(x, y, natureWidth, natureHeight);
        }
    }, [getRelativePosition, props]);

    const handleResizeCropper = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        let {x: mouseX, y: mouseY} = getRelativePosition(e, e.currentTarget);
        const cropper = cropperRef.current;

        const parentWidth = e.currentTarget.offsetWidth;
        const parentHeight = e.currentTarget.offsetHeight;

        mouseX = clamp(mouseX, 0, parentWidth);
        mouseY = clamp(mouseY, 0, parentHeight);

        const handleResizeTopLeft = (e: React.MouseEvent<HTMLDivElement>) => {
            const width = cropper.offsetWidth + Math.floor(cropper.offsetLeft - mouseX);
            const height = cropper.offsetHeight + cropper.offsetTop - mouseY;

            cropper.style.width = width + 'px';
            cropper.style.height = height + 'px';
            cropper.style.left = mouseX + 'px';
            cropper.style.top = mouseY + 'px';

            if (props.onCropChange) {
                const x = mouseX * imageNaturalSize.current.width / parentWidth;
                const y = mouseY * imageNaturalSize.current.height / parentHeight;
                const natureWidth = width * imageNaturalSize.current.width / parentWidth;
                const natureHeight = height * imageNaturalSize.current.height / parentHeight;

                props.onCropChange(x, y, natureWidth, natureHeight);
            }
        }

        const handleResizeTopRight = (e: React.MouseEvent<HTMLDivElement>) => {
            const width = mouseX - cropper.offsetLeft;
            const height = cropper.offsetHeight + cropper.offsetTop - mouseY;

            cropper.style.width = width + 'px';
            cropper.style.height = height + 'px';
            cropper.style.top = mouseY + 'px';

            if (props.onCropChange) {
                const x = cropper.offsetLeft * imageNaturalSize.current.width / parentWidth;
                const y = mouseY * imageNaturalSize.current.height / parentHeight;
                const natureWidth = width * imageNaturalSize.current.width / parentWidth;
                const natureHeight = height * imageNaturalSize.current.height / parentHeight;

                props.onCropChange(x, y, natureWidth, natureHeight);
            }
        }

        const handleResizeBottomLeft = (e: React.MouseEvent<HTMLDivElement>) => {
            const width = cropper.offsetWidth + Math.floor(cropper.offsetLeft - mouseX);
            const height = mouseY - cropper.offsetTop;

            cropper.style.width = width + 'px';
            cropper.style.height = height + 'px';
            cropper.style.left = mouseX + 'px';

            if (props.onCropChange) {
                const x = mouseX * imageNaturalSize.current.width / parentWidth;
                const y = cropper.offsetTop * imageNaturalSize.current.height / parentHeight;
                const natureWidth = width * imageNaturalSize.current.width / parentWidth;
                const natureHeight = height * imageNaturalSize.current.height / parentHeight;

                props.onCropChange(x, y, natureWidth, natureHeight);
            }
        }

        const handleResizeBottomRight = (e: React.MouseEvent<HTMLDivElement>) => {
            const width = mouseX - cropper.offsetLeft;
            const height = mouseY - cropper.offsetTop;

            cropper.style.width = width + 'px';
            cropper.style.height = height + 'px';

            if (props.onCropChange) {
                const x = cropper.offsetLeft * imageNaturalSize.current.width / parentWidth;
                const y = cropper.offsetTop * imageNaturalSize.current.height / parentHeight;
                const natureWidth = width * imageNaturalSize.current.width / parentWidth;
                const natureHeight = height * imageNaturalSize.current.height / parentHeight;

                props.onCropChange(x, y, natureWidth, natureHeight);
            }
        }

        // 鼠标点击在取景器的角上，开始调整裁切取景器的大小
        switch (movingCornerIndex.current) {
            case 0:
                handleResizeTopLeft(e);
                break;
            case 1:
                handleResizeTopRight(e);
                break;
            case 2:
                handleResizeBottomLeft(e);
                break;
            case 3:
                handleResizeBottomRight(e);
                break;
            default:
                break;
        }
    }, [getRelativePosition, props]);

    const cropperMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!isNaN(moveOrigin.current.x) && !isNaN(moveOrigin.current.y)) {
            handleMoveCropper(e);
        }

        if (movingCornerIndex.current !== -1) {
            handleResizeCropper(e);
        }

    }, [handleMoveCropper, handleResizeCropper]);

    const cropperMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        moveOrigin.current = getRelativePosition(e, e.currentTarget);
    }, [getRelativePosition]);

    const cropperCornerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const target = e.currentTarget;
        if (!target) {
            return;
        }

        movingCornerIndex.current = parseInt(target.dataset.index ?? '-1');
    }, []);

    const cropperCancelAction = useCallback((e) => {
        e.stopPropagation();

        movingCornerIndex.current = -1;
        moveOrigin.current = {x: NaN, y: NaN};
    }, []);

    return (
        <div className="moe-video-image-trimmer"
             onMouseMove={cropperMouseMove}
             onMouseUp={cropperCancelAction}
             onMouseLeave={cropperCancelAction}
        >
            <img src={URL.createObjectURL(props.file)} alt=""
                 onDragStart={(e) => {
                     e.preventDefault();
                 }}
            />

            {/* 裁切取景器 */}
            <div className="moe-video-image-trimmer-cropper" onMouseDown={cropperMouseDown} ref={cropperRef}>
                <div className="moe-video-image-trimmer-cropper-top-left" data-index={0}
                     onMouseDown={cropperCornerMouseDown}
                />
                <div className="moe-video-image-trimmer-cropper-top-right" data-index={1}
                     onMouseDown={cropperCornerMouseDown}
                />
                <div className="moe-video-image-trimmer-cropper-bottom-left" data-index={2}
                     onMouseDown={cropperCornerMouseDown}
                />
                <div className="moe-video-image-trimmer-cropper-bottom-right" data-index={3}
                     onMouseDown={cropperCornerMouseDown}
                />
            </div>
        </div>
    );

});

const ImageUpload = memo(() => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const cropPos = useRef({x: 0, y: 0, width: 0, height: 0});
    // const canvas = useRef(OffscreenCanvas ? new OffscreenCanvas(1, 1) : document.createElement('canvas'));
    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (inputRef.current) {
            inputRef.current.click();
        }
    }, []);
    const canvas = useRef(OffscreenCanvas ? new OffscreenCanvas(1, 1) : document.createElement('canvas'));
    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        console.log(file);
        showModal({
            title: '图片裁剪',
            content: (<ImageTrimmer file={file} onCropChange={(x, y, width, height) => {
                cropPos.current = {x, y, width, height};
            }}/>),
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

                    ctx.drawImage(image,
                        cropPos.current.x,
                        cropPos.current.y,
                        cropPos.current.width,
                        cropPos.current.height,
                        0,
                        0,
                        cropPos.current.width,
                        cropPos.current.height);

                    if (canvas.current instanceof HTMLCanvasElement) {
                        const dataUrl = canvas.current.toDataURL('image/jpeg');
                        setImageUrl(dataUrl);
                        setFile(new File([dataUrl], file.name));
                    } else {
                        canvas.current.convertToBlob({type: 'image/jpeg'}).then(blob => {
                            setFile(new File([blob], file.name));
                            setImageUrl(URL.createObjectURL(blob));
                        });
                    }
                };
            }
        });

    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.border = '2px dashed #ccc';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.border = 'none';
        const file = e.dataTransfer.files[0];
        if (!file.type.startsWith('image')) {
            showMessage({children: '请上传图片文件'});
            return;
        }

        handleFileChange({target: {files: [file]}});
    }, [handleFileChange]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.border = 'none';
    }, []);


    if (file) {
        return (
            <>
                <input type="file" ref={inputRef} accept="image/png, image/jpeg, image/webp"
                       style={{display: 'none'}} onChange={handleFileChange}/>
                <Button onClick={handleClick}>
                    <span>重新上传</span>
                </Button>
                <img src={imageUrl} alt="" style={{
                    marginTop: '0.5rem',
                    borderRadius: '0.5rem',
                }}/>
            </>
        );
    }

    return (
        <>
            <div className="moe-video-image-upload-page-container"
                 onDragEnter={handleDragEnter}
                 onDragOver={handleDragOver}
                 onDrop={handleDrop}
                 onDragLeave={handleDragLeave}
            >
                <input type="file" ref={inputRef} accept="image/png, image/jpeg, image/webp"
                       style={{display: 'none'}} onChange={handleFileChange}/>
                <button className="moe-video-image-upload-page-button"
                        onClick={handleClick}
                >
                    <ImageIcon/>
                    <span>上传图片</span>
                </button>
            </div>
        </>
    );

});

export default ImageUpload;
