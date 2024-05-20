import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getUserInfo, modifyUserInfo } from '../../common/user';
import LoadingPage from '../Loading/LoadingPage.tsx';
import { Button, Input, showMessage, showModal } from '@natsume_shiki/mika-ui';
import './Setting.less';
import { useTitle } from '../../common/hooks';
import AvatarUpload from './AvatarUpload.tsx';
import { addFeedback } from '../../common/video';

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
  const formRef = useRef<HTMLFormElement>(null);

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
                <form ref={formRef}>
                  <div className='py-2'>
                    <label className='moe-video-space-page-feedback-label mb-1 block'>邮箱</label>
                    <input
                      placeholder='请输入您的邮箱'
                      name='email'
                      type='email'
                      className='moe-video-space-page-feedback-input'
                    />
                  </div>
                  <label className='moe-video-space-page-feedback-label block mb-1'>反馈</label>
                  <textarea
                    name='content'
                    className='moe-video-space-page-feedback-textarea'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder='请输入您的反馈'
                  />
                </form>
              ),
              onOk: async () => {
                const formData = new FormData(formRef.current);

                if (formData.get('email') === '' || formData.get('content') === '') {
                  showMessage({ children: '请填写完整' });
                  return false;
                }
                // 校验邮箱
                if (!formRef?.current?.email.checkValidity()) {
                  showMessage({ children: '请输入正确的邮箱' });
                  return false;
                }

                return addFeedback(formData.get('content') as string, formData.get('email') as string).then((r) => {
                  if (r.code === 200) {
                    showMessage({ children: '感谢您的反馈！' });
                    return true;
                  }
                  showMessage({ children: '提交失败' });
                  return false;
                });
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
