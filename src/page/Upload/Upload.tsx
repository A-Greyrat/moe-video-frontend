import React, {memo} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";

import './Upload.less';
import VideoUpload from "./VideoUpload.tsx";
import {Button} from "@natsume_shiki/mika-ui";
import ImageUpload from "./ImageUpload.tsx";

const unknown_url = 'https://abdecd.xyz/moe/common/public-key';

const Upload = memo(() => {

    return (
        <div className="moe-video-upload-page-wrapper">
            <Header/>
            <div className="moe-video-upload-page-content">
                <div className="moe-video-upload-page-content-title">
                    上传
                </div>
                <div className="moe-video-upload-page-content-form">
                    <form>
                        <div className="moe-video-upload-page-content-form-item">
                            <VideoUpload/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>标题</label>
                            <input type="text" name="title"/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>封面</label>
                            <ImageUpload/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>标签</label>
                            <input type="text" name="tags"/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <label>简介</label>
                            <textarea name="description"/>
                        </div>
                        <div className="moe-video-upload-page-content-form-item">
                            <Button style={{
                                width: '100%',
                            }} type="submit" styleType='primary' size='large'>上传</Button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer/>
        </div>
    );
});

export default Upload;
