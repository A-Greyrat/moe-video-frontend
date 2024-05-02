import {useTitle} from "../../common/hooks";

const LoadingPage = () => {
    useTitle("Loading...");

    return (
        <svg xmlns="http://www.w3.org/2000/svg" style={{margin: 'auto', minHeight: '100vh',background: 'transparent', display: 'block', shapeRendering: 'auto'}} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="16" strokeWidth="4" stroke="#a692b1" strokeDasharray="25.132741228718345 25.132741228718345" fill="none" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" dur="1.1764705882352942s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;360 50 50"/>
            </circle>
            <circle cx="50" cy="50" r="11" strokeWidth="4" stroke="#ceb7d5" strokeDasharray="17.27875959474386 17.27875959474386" strokeDashoffset="17.27875959474386" fill="none" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" dur="1.1764705882352942s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;-360 50 50"/>
            </circle>
        </svg>
    )
}

export default LoadingPage;
