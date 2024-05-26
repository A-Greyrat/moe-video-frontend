import { useEffect, useState } from 'react';
import { addFeedback } from '../../common/video';

const Error = () => {
  const [log, setLog] = useState<any>(null);

  useEffect(() => {
    setLog(JSON.parse(localStorage.getItem('error') || '{}'));

    addFeedback(localStorage.getItem('error'), 'SYSTEM_ERROR@erisu.moe');
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

      <pre
        style={{
          textAlign: 'left',
          color: '#666',
          marginTop: '20px',
        }}
      >
        错误信息：{log?.error || '未知错误'}
      </pre>

      <pre style={{ textAlign: 'left', fontSize: '16px', color: '#666', marginTop: '20px' }}>
        错误堆栈:
        {log?.errorInfo?.componentStack || '未知错误'}
      </pre>

      <p
        style={{
          textAlign: 'left',
          fontSize: '24px',
          color: '#666',
          marginTop: '20px',
        }}
      >
        请将错误信息反馈给开发人员
      </p>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        <button
          type='button'
          onClick={() => {
            alert('发送成功, 请等待开发人员处理');
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
          发送错误报告
        </button>

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
    </div>
  );
};

export default Error;
