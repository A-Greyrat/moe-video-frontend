import { memo, useCallback, useEffect, useState } from 'react';
import { getUserInfo, modifyUserInfo } from '../../common/user';
import LoadingPage from '../Loading/LoadingPage.tsx';
import { Button, Input, showMessage, showModal } from '@natsume_shiki/mika-ui';
import './Setting.less';
import { useTitle } from '../../common/hooks';
import AvatarUpload from './AvatarUpload.tsx';

const ValueField = memo(
  (props: {
    label: string;
    initValue: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
  }) => {
    const { label, initValue, onChange, onBlur } = props;
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState(initValue);

    return (
      <div className='flex items-center'>
        <p className='w-24 text-gray-600 font-bold'>{label}</p>
        {isEdit ? (
          <Input
            value={value}
            onChange={(e) => {
              onChange && onChange(e.target.value);
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEdit(false);
                onBlur && onBlur(value);
                e.preventDefault();
              }
            }}
            onBlur={() => {
              setIsEdit(false);
              onBlur && onBlur(value);
            }}
          />
        ) : (
          <p onClick={() => setIsEdit(true)}>{value}</p>
        )}
      </div>
    );
  },
);

const Setting = memo(() => {
  const [userInfo, setUserInfo] = useState(null);
  const [_, forceUpdate] = useState(0);

  useTitle('设置');

  useEffect(() => {
    getUserInfo().then((res) => {
      setUserInfo(res);
    });
  }, [_]);

  const modifyInfo = useCallback(
    (info: { nickname?: string; signature?: string; avatar?: File }) => {
      const newInfo = {
        nickname: info.nickname,
        signature: info.signature,
        avatar: info.avatar,
      };

      if (
        newInfo.nickname === userInfo.nickname &&
        newInfo.signature === userInfo.signature &&
        newInfo.avatar === undefined
      ) {
        return;
      }

      modifyUserInfo(newInfo)
        .then(() => {
          showMessage({ children: '修改成功' });
          setUserInfo({
            ...userInfo,
            nickname: newInfo.nickname ? newInfo.nickname : userInfo.nickname,
            signature: newInfo.signature ? newInfo.signature : userInfo.signature,
            avatar: newInfo.avatar ? URL.createObjectURL(newInfo.avatar) : userInfo.avatar,
          });
        })
        .catch(() => {
          showMessage({ children: '修改失败' });
          forceUpdate((v) => v + 1);
        });
    },
    [userInfo],
  );

  if (userInfo === null) {
    return <LoadingPage />;
  }

  return (
    <div className='flex flex-col gap-6 mt-7'>
      <div className='flex gap-3 items-center'>
        <p className='w-24 text-gray-600 font-bold'>用户头像</p>
        <AvatarUpload
          style={{
            aspectRatio: '1 / 1',
            width: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          initAvatar={userInfo.avatar}
          onFileChange={(file) => {
            modifyInfo({ avatar: file });
          }}
        />
      </div>
      <hr />
      <div className='flex items-center'>
        <p className='w-24 text-gray-600 font-bold'>用户ID</p>
        <p>{userInfo.userId}</p>
      </div>
      <hr />
      <ValueField
        label={'用户名'}
        initValue={userInfo.nickname}
        onBlur={(value) => {
          modifyInfo({ nickname: value });
        }}
      />
      <hr />
      <ValueField
        label={'个性签名'}
        initValue={userInfo.signature ? userInfo.signature : '这个人很懒，什么都没有留下'}
        onBlur={(value) => {
          modifyInfo({ signature: value });
        }}
      />
      <hr />
      <div className='flex items-center'>
        <p className='w-24 text-gray-600 font-bold'>反馈</p>
        <Button
          styleType='primary'
          onClick={() => {
            showModal({
              title: '反馈',
              content: (
                <div>
                  <textarea
                    className='moe-video-space-page-feedback-textarea'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder='请输入您的反馈'
                  />
                </div>
              ),
              onOk: () => {
                showMessage({ children: '感谢您的反馈！' });
              },
              footer: 'ok close',
            });
          }}
        >
          提交反馈
        </Button>
      </div>
    </div>
  );
});

export default Setting;
