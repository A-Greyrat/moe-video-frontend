import './Header.less';
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {isUserLoggedIn, logout, useUser} from "../../common/user";
import {AutoComplete, Button, debounceAsync, Dropdown, Image} from "@natsume_shiki/mika-ui";
import {useLocation, useNavigate} from "react-router-dom";

const UserSection = () => {
    const [avatar] = useState("/defaultAvatar.webp");
    const userInfo = useUser();
    const nav = useNavigate();

    return (
        <Dropdown menu={<div style={{
            width: 200,
            backgroundColor: "white",
            boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.1)",
            borderRadius: 5
        }}>
            {userInfo && userInfo.userId !== 0 && <div style={{padding: 10, borderBottom: "1px solid #e7e7e7"}}>
                <div style={{marginTop: "30px"}}>
                    <p style={{fontSize: 12, color: "#666", textAlign: 'center'}}>
                        <span>账号：{userInfo?.nickname}</span>
                        <span style={{marginLeft: 10}}>ID：{userInfo?.userId}</span>
                    </p>
                    <Button styleType="link" onClick={() => {
                        logout();
                        window.location.reload();
                    }}>登出</Button>
                </div>
            </div>}

            {(!userInfo) && <div style={{padding: 10}}>
                <div style={{marginTop: "30px", display: "flex", justifyContent: "center",}}>
                    <Button styleType="link" onClick={() => {
                        nav("/login");
                    }}>登录</Button>
                </div>
            </div>}
        </div>} paddingTrigger={10} className="moe-video-header-user-dropdown">
            <div className="moe-video-header-user">
                <Image src={avatar} lazy width={42} height={42} alt="" onClick={() => {
                    nav(isUserLoggedIn ? "/space" : "/login");
                }}/>
            </div>
        </Dropdown>);
}
const SearchSection = () => {
    const nav = useNavigate();
    const location = useLocation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dataSrc, setDataSrc] = React.useState<string[]>([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _getSearchAutoComplete = useCallback(debounceAsync(async (keyword: string) => {
        if (!keyword) {
            setDataSrc([]);
            return Promise.resolve();
        }
        // const res = await getSearchAutoComplete(keyword);
        // setDataSrc(res);
    }, 200), []);

    useEffect(() => {
        if (location.pathname.startsWith("/search")) {
            if (inputRef.current) {
                const temp =  location.pathname.split("/");
                if (temp.length < 5) {
                    inputRef.current.value = decodeURIComponent(temp[2]);
                }
                else inputRef.current.value = decodeURIComponent(temp[3]);
            }
        }
    }, [location.pathname, nav]);

    return (
        <div className="moe-video-header-search">
            <AutoComplete placeholder="搜索" size='large' type='filled'
                          dataSrc={dataSrc} onValueChange={(key) => {
                return _getSearchAutoComplete(key);
            }} onOptionClick={(item) => {
                nav(`/search/${item}/1`);
            }} onOptionKeyDown={(item) => {
                nav(`/search/${item}/1`);
            }} onSubmit={(item) => {
                if (!item) return;
                nav(`/search/${item}/1`);
            }} ref={inputRef}/>
        </div>
    );
}
const FavorDropdown = () => {
    const nav = useNavigate();

    return (
        <Dropdown menu={<div></div>} paddingTrigger={10} className="moe-video-header-favor" callback={() => {
        }}>
            <div className='trigger' onClick={() => {
                nav("/space/favor");
            }}>收藏
            </div>
        </Dropdown>
    );

}
const HistoryDropdown = () => {
    const nav = useNavigate();

    return (
        <Dropdown menu={<div></div>} paddingTrigger={10} className="moe-video-header-history" callback={() => {

        }}>
            <div className='trigger' onClick={() => {
                nav("/space/history");
            }}>历史
            </div>
        </Dropdown>
    );
}


const Header = memo(() => {
    const nav = useNavigate();

    return (
        <header className="moe-video-header-container">
            <p className="moe-video-header-icon" onClick={() => {
                nav("/");
            }}>Moe</p>
            <SearchSection/>
            <div className="moe-video-header-right">
                <UserSection/>
                <FavorDropdown/>
                <HistoryDropdown/>
                <div className="moe-video-header-category" onClick={() => {
                    nav("/category");
                }}>分类
                </div>
                <Dropdown menu={
                    <div className="moe-video-header-dropdown">
                        <Button onClick={() => {
                            nav("/space");
                        }} styleType="text">个人中心</Button>
                        <Button styleType="text" onClick={() => {
                            nav("/category");
                        }}>分类</Button>
                        <Button styleType="text" onClick={() => {
                            nav("/upload");
                        }}>上传</Button>
                    </div>} position='right' paddingTrigger={10} className="moe-video-header-dropdown-container">
                    <div className="moe-video-header-ellipsis">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <circle cx="12" cy="12" r="2" fill="#777"/>
                            <circle cx="6" cy="12" r="2" fill="#777"/>
                            <circle cx="18" cy="12" r="2" fill="#777"/>
                        </svg>
                    </div>
                </Dropdown>
                <div className="moe-video-header-upload" onClick={() => {
                    nav("/upload");
                }}>上传
                </div>
            </div>
        </header>
    );
});

export default Header;
