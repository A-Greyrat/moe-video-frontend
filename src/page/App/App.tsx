import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import router from '../../router';
import LoadingPage from '../Loading/LoadingPage';

import { statistics } from '../../common/finger';

const App = () => {
  useEffect(() => {
    statistics();
  }, []);

  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
