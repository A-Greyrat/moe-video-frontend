import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import ErrorBoundary from '../page/ErrorBoundary';
import Error from '../page/Error';

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
    element: (
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    ),
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <Login />{' '}
      </ErrorBoundary>
    ),
  },
  {
    path: '/register',
    element: (
      <ErrorBoundary>
        <Register />
      </ErrorBoundary>
    ),
  },
  {
    path: '/video/:id',
    element: (
      <ErrorBoundary>
        <Video />
      </ErrorBoundary>
    ),
  },
  {
    path: '/search/:type/:id/:page',
    element: (
      <ErrorBoundary>
        <Search />
      </ErrorBoundary>
    ),
  },
  {
    path: '/search/:id/:page',
    element: (
      <ErrorBoundary>
        <Search />
      </ErrorBoundary>
    ),
  },
  {
    path: '/search/:id',
    element: (
      <ErrorBoundary>
        {' '}
        <Search />
      </ErrorBoundary>
    ),
  },
  {
    path: '/upload',
    element: (
      <ErrorBoundary>
        <Upload />
      </ErrorBoundary>
    ),
  },
  {
    path: '/space',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
  },
  {
    path: '/space/favor',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
  },
  {
    path: '/space/bangumi',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
  },
  {
    path: '/space/upload',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
  },
  {
    path: '/space/history',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
  },
  {
    path: '/space/setting',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
  },
  {
    path: '/bangumi/index/:id',
    element: (
      <ErrorBoundary>
        <BangumiIndex />
      </ErrorBoundary>
    ),
  },
  {
    path: '/bangumi/index',
    element: (
      <ErrorBoundary>
        <BangumiIndex />
      </ErrorBoundary>
    ),
  },
  {
    path: '/error',
    element: (<Error />),
  },
  {
    path: '*',
    element: <$404 />,
  },
]);
