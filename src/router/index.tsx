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
    hasErrorBoundary: true,
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <Login />{' '}
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/register',
    element: (
      <ErrorBoundary>
        <Register />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/video/:id',
    element: (
      <ErrorBoundary>
        <Video />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/search/:type/:id/:page',
    element: (
      <ErrorBoundary>
        <Search />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/search/:id/:page',
    element: (
      <ErrorBoundary>
        <Search />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/search/:id',
    element: (
      <ErrorBoundary>
        {' '}
        <Search />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/upload',
    element: (
      <ErrorBoundary>
        <Upload />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/space',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/space/favor',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/space/bangumi',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/space/upload',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/space/history',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/space/setting',
    element: (
      <ErrorBoundary>
        <Space />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/bangumi/index/:id',
    element: (
      <ErrorBoundary>
        <BangumiIndex />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/bangumi/index',
    element: (
      <ErrorBoundary>
        <BangumiIndex />
      </ErrorBoundary>
    ),
    hasErrorBoundary: true,
  },
  {
    path: '/error',
    element: <Error />,
  },
  {
    path: '*',
    element: <$404 />,
    errorElement: <Error />,
  },
]);
