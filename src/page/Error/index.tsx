import { useEffect, useState } from 'react';

const Error = () => {
  const [log, setLog] = useState<any>(null);

  useEffect(() => {
    setLog(JSON.parse(localStorage.getItem('error') || '{}'));
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p
        style={{
          textAlign: 'left',
          fontSize: '48px',
          color: '#333',
          marginTop: '100px',
          fontWeight: 'bold',
        }}
      >
        浏览器页面出错，请刷新重试
      </p>
      <pre style={{ textAlign: 'left', fontSize: '16px', color: '#666', marginTop: '20px' }}>
        {log?.errorInfo?.componentStack || '未知错误'}
      </pre>

      <button
        type='button'
        onClick={() => {
          window.location.pathname = '/';
        }}
        style={{
          display: 'block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        回到首页
      </button>
    </div>
  );
};

export default Error;
