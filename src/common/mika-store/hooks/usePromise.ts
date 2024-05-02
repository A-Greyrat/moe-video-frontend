import {useEffect, useState} from "react";

const usePromise = <T, >(promise: Promise<T>): [T | undefined, (arg: T) => void] => {
    const [data, setData] = useState<T>();

    useEffect(() => {
        promise.then((data) => {
            setData(data);
        });
    }, []);

    return [data, setData];
};

export default usePromise;
