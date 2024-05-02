import './Footer.less';
import {memo} from "react";

const Footer = memo(() => {
    return (
        <footer className="moe-video-footer-container">
            <p style={{
                fontSize: "20px",
                fontWeight: "400",
                color: "grey",
                textAlign: "center",
            }}>
                已经到底了
            </p>
        </footer>
    )
});

export default Footer;
