import { useCallback, useEffect, useRef, useState } from 'react';

export const useTypePrint = (text: string[], speed = 100) => {
  const [displayText, setDisplayText] = useState('');
  const isDeleting = useRef(false);
  const nowIndex = useRef(0);
  const nowLine = useRef(0);
  const timer = useRef<number>();

  const print = useCallback(async () => {
    if (nowIndex.current === text[nowLine.current].length + 1 && !isDeleting.current) {
      isDeleting.current = true;
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    } else if (nowIndex.current === -1 && isDeleting.current) {
      nowLine.current = (nowLine.current + 1) % text.length;
      isDeleting.current = false;
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    }

    if (isDeleting.current) {
      setDisplayText(text[nowLine.current].substring(0, nowIndex.current));
      // eslint-disable-next-line no-plusplus
      nowIndex.current--;
    } else {
      setDisplayText(text[nowLine.current].substring(0, nowIndex.current));
      // eslint-disable-next-line no-plusplus
      nowIndex.current++;
    }

    timer.current = setTimeout(print, isDeleting.current ? speed / 3 : speed);
  }, [speed, text]);

  useEffect(() => {
    print();
    return () => {
      window.clearTimeout(timer.current as number);
    };
  }, [print]);

  return displayText;
};

export const useTitle = (title: string) => {
  useEffect(() => {
    window.scroll({ top: 0 });
    document.title = title;
  }, [title]);
};
