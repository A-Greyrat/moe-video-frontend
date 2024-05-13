import {memo, useEffect, useState} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import {TabList} from "@natsume_shiki/mika-ui";


const Space = memo(() => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        // get user favor list, history list, etc.

    }, []);

    return (<div>
        <Header/>
        <div>
            <TabList items={['收藏', '历史', '上传']} activeIndex={activeIndex}  onChange={(index) => {
                setActiveIndex(index);
            }}/>
        </div>
        <Footer/>
    </div>);
});

Space.displayName = 'Space';
export default Space;
