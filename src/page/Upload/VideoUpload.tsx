import React, {memo, useCallback, useRef, useState} from "react";

import './VideoUpload.less';
import VideoPlayer from "mika-video-player";
import {useTitle} from "../../common/hooks";
import {Button, showMessage} from "@natsume_shiki/mika-ui";
import {uploadFileToOss} from "../../common/oss";
import {useStore} from "mika-store";

const VideoIcon = memo(() => {

    return (
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             width="25" height="25">
            <path
                d="M49.770667 199.104H658.773333c19.925333 5.674667 33.493333 14.336 42.24 25.024 8.448 10.24 11.157333 20.117333 11.157334 25.066667v214.250666l262.357333-168.682666v414.826666l-262.357333-168.661333v148.096a24.896 24.896 0 1 0 49.770666 0v-62.442667l262.378667 174.186667V203.605333L761.92 372.266667v-123.093334c0-15.488-5.696-36.266667-22.464-56.661333-16-19.477333-39.573333-34.133333-71.104-42.368L665.258667 149.333333H0v608.96l0.768 3.029334c2.986667 11.669333 9.173333 27.989333 19.690667 44.629333 18.730667 29.653333 44.906667 48.725333 79.146666 49.066667h637.44a24.896 24.896 0 0 0 0-49.770667H99.84c-14.4-0.149333-26.752-9.130667-37.333333-25.877333a120.213333 120.213333 0 0 1-12.757334-27.690667V199.104z"
                fill="#ceb7d5"></path>
            <path
                d="M205.909333 324.48a46.506667 46.506667 0 1 1-92.992-0.042667 46.506667 46.506667 0 0 1 92.992 0.021334z"
                fill="#ceb7d5"></path>
        </svg>)
});

const VideoUpload = memo(() => {
    useTitle('上传');

    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_uploadVideoUrl, setUploadVideoUrl] = useStore('uploadVideoUrl');

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (inputRef.current) {
            inputRef.current.click();
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        setFile(null);
        setVideoUrl(null);

        setTimeout(() => {
            setFile(file);
            setVideoUrl(URL.createObjectURL(file));
        }, 0);
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
        if (!file.type.startsWith('video') && !file.name.endsWith('.flv') && !file.name.endsWith('.mkv')) {
            showMessage({children: '请上传视频文件'});
            return;
        }

        setFile(null);
        setVideoUrl(null);

        setTimeout(() => {
            setFile(file);
            setVideoUrl(URL.createObjectURL(file));
        }, 0);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.currentTarget.style.border = 'none';
    }, []);

    const handleUpload = useCallback(() => {
        if (!file) {
            showMessage({children: '请上传视频文件'});
            return;
        }
        if (uploading) {
            showMessage({children: '正在上传'});
            return;
        }

        uploadFileToOss(file, (progress) => {
            setUploadProgress(progress);
        }).then(r => {
            setUploading(true);
            setUploadVideoUrl(r);
        }).catch(e => {
            showMessage({children: e.message});
        });
    }, [file, setUploadVideoUrl, uploading]);

    if (file) {
        return (
            <>
                <div className="moe-video-upload-container-loaded">
                    <input type="file" accept="video/*,.flv,.mkv" ref={inputRef} onChange={handleFileChange}/>
                    <Button onClick={handleClick}>
                        点击重新上传
                    </Button>
                    <Button onClick={handleUpload}>
                        确认上传
                    </Button>
                    {uploading && (
                        <div>
                            <div>上传中</div>
                            <div>{uploadProgress}%</div>
                        </div>
                    )}
                </div>

                <VideoPlayer src={videoUrl} controls style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                }}/>
            </>
        );
    }

    return (
        <div className="moe-video-upload-container"
             onDragEnter={handleDragEnter}
             onDragOver={handleDragOver}
             onDrop={handleDrop}
             onDragLeave={handleDragLeave}
        >
            <input type="file" accept="video/*,.flv,.mkv" ref={inputRef} onChange={handleFileChange}/>
            <button onClick={handleClick}>
                <VideoIcon/>
                点击或拖拽上传
            </button>
        </div>
    );
});

export default VideoUpload;
