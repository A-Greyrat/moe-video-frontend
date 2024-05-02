import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";

import {useTitle} from "../../common/hooks";
import {Carousel, Image} from "../../component/mika-ui";

import './Home.less';

const CarouselItem = () => {
    return (<div className="moe-video-home-page-carousel-item relative">
        <Image src='/Suzumiya_Haruhi_no_Shoushitsu.png'/>
        <div className='absolute left-0 bottom-0 bg-black opacity-50 pt-4 pb-6 px-6 w-full'>
            <div className='text-white text-3xl font-bold mb-2 flex items-baseline'>
                <span>凉宫春日的消失</span>
                <span className='text-base font-normal ml-2.5 bg-red-500 px-2 py-0.5 rounded-lg'>9.9分</span>
            </div>
            <div className='text-white text-base line-clamp-2'>
                圣诞节即将来临，SOS团火锅派对的活动拍板以后，阿虚就带着烦恼回家。第二天，阿虚如常上学，但他很快注意到，学校发生了与平日完全不同的事。应该在后面的座位的凉宫春日不在，却换上了理应让长门有希消灭了的朝仓凉子；不仅是这样，全世界也都变了……
            </div>
        </div>
    </div>);
};

const Home = () => {
    useTitle("首页");

    return (<div className="moe-video-home-page-root">
            <Header/>
            <div className="moe-video-home-page-wrapper">
                {/* 轮播图 */}
                <Carousel className='moe-video-home-page-carousel rounded-lg' items={[
                    <CarouselItem/>,
                    <CarouselItem/>,
                ]}/>

                {/* 索引列表 */}
                <div className='moe-video-home-page-index-wrapper flex gap-4 my-12'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                {/* 追番列表 */}
                <div className='flex items-center pb-5'>
                    <img className='h-11' src='/chasing.png' alt=''/>
                    <span className='text-3xl font-bold ml-4' style={{color: '#333'}}>我的追番</span>
                </div>

                <div className='moe-video-home-page-chasing-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                {/* 时间表 */}
                <div className='flex items-center pb-5'>
                    <img className='h-11' src='/clock.png' alt=''/>
                    <span className='text-3xl font-bold ml-4' style={{color: '#333'}}>新番时间表</span>
                </div>

                <div className='moe-video-home-page-timeline-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                {/* 推荐列表 */}
                <div className='flex items-center pb-5'>
                    <span className='text-3xl font-bold' style={{color: '#333'}}>猜你喜欢</span>
                </div>

                <div className='moe-video-home-page-recommend-list pt-2 pb-4 px-1 mb-12 gap-4 flex overflow-auto'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
