import { createBrowserRouter } from 'react-router-dom';
import React from 'react';

const BangumiIndex = React.lazy(() => import('../page/Index/BangumiIndex'));
const Home = React.lazy(() => import('../page/Home/Home'));
const Login = React.lazy(() => import('../page/Login/Login'));
const Register = React.lazy(() => import('../page/Login/Register'));
const $404 = React.lazy(() => import('../page/404/404'));
const Video = React.lazy(() => import('../page/Video/Video'));
const Search = React.lazy(() => import('../page/Search/Search'));
const Upload = React.lazy(() => import('../page/Upload/Upload'));
const Space = React.lazy(() => import('../page/Space/Space'));

export default createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/video/:id',
    element: <Video />,
  },
  {
    path: '/search/:type/:id/:page',
    element: <Search />,
  },
  {
    path: '/search/:id/:page',
    element: <Search />,
  },
  {
    path: '/search/:id',
    element: <Search />,
  },
  {
    path: '/upload',
    element: <Upload />,
  },
  {
    path: '/space',
    element: <Space />,
  },
  {
    path: '/space/favor',
    element: <Space />,
  },
  {
    path: '/space/bangumi',
    element: <Space />,
  },
  {
    path: '/space/upload',
    element: <Space />,
  },
  {
    path: '/space/history',
    element: <Space />,
  },
  {
    path: '/space/setting',
    element: <Space />,
  },
  {
    path: '/bangumi/index/:id',
    element: <BangumiIndex />,
  },
  {
    path: '/bangumi/index',
    element: <BangumiIndex />,
  },
  {
    path: '*',
    element: <$404 />,
  },
]);
