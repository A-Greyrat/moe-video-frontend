import {memo, useCallback, useRef, useState} from "react";

import './ImageUpload.less';
import {Button} from "@natsume_shiki/mika-ui";

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
const ImageUpload = memo(() => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleClick = useCallback((e) => {
        e.preventDefault();

        if (inputRef.current) {
            inputRef.current.click();
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        setFile(null);
        setImageUrl(null);

        setTimeout(() => {
            setFile(file);
            setImageUrl(URL.createObjectURL(file));
        }, 0);
        console.log(file);
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.currentTarget.style.border = '2px dashed #ccc';
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.currentTarget.style.border = 'none';
        const file = e.dataTransfer.files[0];
        if (!file.type.startsWith('image')) {
            alert('请上传图片文件');
            return;
        }

        setFile(null);
        setImageUrl(null);

        setTimeout(() => {
            setFile(file);
            setImageUrl(URL.createObjectURL(file));
        }, 0);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
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
            <div className="moe-video-image-upload-page-conrainer"
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
