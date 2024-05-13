import React, {memo} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import VideoUpload from "./VideoUpload.tsx";
import {Button, showMessage} from "@natsume_shiki/mika-ui";
import ImageUpload from "./ImageUpload.tsx";

import './Upload.less';
import {useStore} from "mika-store";
import {uploadVideo} from "../../common/video";
import {useNavigate} from "react-router-dom";

const Upload = memo(() => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [uploadCoverUrl, _setUploadCoverUrl] = useStore<string>('uploadCoverUrl', '');
    const [uploadVideoUrl, _setUploadVideoUrl] = useStore<string>('uploadVideoUrl', '');
    const navigate = useNavigate();

    const handleSubmit = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (formRef.current) {
            // name: video, title, tags, description, cover
            const title = formRef.current.querySelector('input[name="title"]') as HTMLInputElement;
            const tags = formRef.current.querySelector('input[name="tags"]') as HTMLInputElement;
            const description = formRef.current.querySelector('textarea[name="description"]') as HTMLInputElement;

            const formData = new FormData();
            formData.append('video', uploadVideoUrl);
            formData.append('title', title.value);
            formData.append('tags', tags.value);
            formData.append('description', description.value);
            formData.append('cover', uploadCoverUrl);


            if (!uploadVideoUrl || !uploadCoverUrl) {
                showMessage({children: '请上传视频和封面'});
                return;
            }

            if (!title.value) {
                showMessage({children: '请填写标题'});
                return;
            }

            if (!tags.value) {
                showMessage({children: '请填写标签'});
                return;
            }

            if (!description.value) {
                showMessage({children: '请填写简介'});
                return;
            }
            uploadVideo({
                title: title.value,
                description: description.value,
                cover: uploadCoverUrl,
                link: 'http://resource.abdecd.xyz/' + uploadVideoUrl
            }).then(r => {
                if (r.code === 200) {
                    showMessage({children: '上传成功'});
                    navigate('/');
                } else {
                    showMessage({children: r.msg});
                }
            });
        }
    }, [navigate, uploadCoverUrl, uploadVideoUrl]);

    return (
        <div className="moe-video-upload-page-wrapper">
            <Header/>
            <div className="moe-video-upload-page-content">
                <div className="moe-video-upload-page-content-title">
                    上传
                </div>
                <div className="moe-video-upload-page-content-form">
                    <form onSubmit={e => {
                        e.preventDefault();
                    }} ref={formRef}>
                        <div className="moe-video-upload-page-content-form-item">
                            <VideoUpload/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>标题</label>
                            <input type="text" name="title" onKeyDown={(e) => {
                                if (e.key === 'Enter') e.preventDefault();
                            }}/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>封面</label>
                            <ImageUpload/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>标签</label>
                            <input type="text" name="tags" onKeyDown={(e) => {
                                if (e.key === 'Enter') e.preventDefault();
                            }}/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>简介</label>
                            <textarea name="description"/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <Button style={{width: '100%',}}
                                    type="submit"
                                    styleType='primary'
                                    size='large'
                                    onClick={handleSubmit}
                            >
                                上传
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer/>
        </div>
    );
});

export default Upload;
