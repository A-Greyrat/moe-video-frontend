import {createBrowserRouter} from "react-router-dom";
import React from "react";

const Home = React.lazy(() => import('../page/Home/Home'));
const Login = React.lazy(() => import('../page/Login/Login'));
const Register = React.lazy(() => import('../page/Login/Register'));
const $404 = React.lazy(() => import('../page/404/404'));
const Video = React.lazy(() => import('../page/Video/Video'));
const Search = React.lazy(() => import('../page/Search/Search'));

export default createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/register',
        element: <Register/>,
    },
    {
        path: '/video/:id',
        element: <Video/>,
    },
    {
        path: '/search/:id/:page',
        element: <Search/>,
    },
    {
        path: '*',
        element: <$404/>,
    },
]);
