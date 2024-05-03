import {memo} from "react";
import VideoPlayer from "mika-video-player";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import './Video.less';

const Video = memo(() => {

    return (
        <div className="moe-video-video-root">
            <Header/>
            <div className="moe-video-video-wrapper">
                <div>
                    <VideoPlayer src='/私は雨.flv' controls/>
                </div>
            </div>
            <Footer/>
        </div>
    );
});

export default Video;
