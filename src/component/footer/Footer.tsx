import './Footer.less';
import {memo} from "react";
import {useTypePrint} from "../../common/hooks";

const powerBy = [
    'Misono Mika',
    'Shikibe Mayu',
    'Shiki Natsume',
    'Eris Greyrat',
    'Waraku Chise',
];

const Footer = memo(() => {
    const displayText = useTypePrint(powerBy, 100);

    return (
        <footer className="moe-video-footer-container">
            <p className="text-gray-400 text-center text-sm select-none">
                Powered by <a href="#" style={{color:'#ceb7d5'}}>{displayText}</a>
            </p>
            <p className="text-gray-400 text-center text-sm select-none">
                © 2024 Moe Video. All Rights Reserved.
            </p>
        </footer>
    )
});

export default Footer;
