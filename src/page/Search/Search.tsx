import {memo, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export interface SearchItemProps {
    title: string;
    playCount: number;
    danmakuCount: number;
    cover: string;
}

const Search = memo(() => {
    const {id, page} = useParams();
    const [items, setItems] = useState<SearchItemProps[]>([]);

    useEffect(() => {
    }, []);


    return (
        <div>
        </div>
    );
});

export default Search;
