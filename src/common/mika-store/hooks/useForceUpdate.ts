import {useState} from "react";

export default () => {
    const [_, forceUpdate] = useState(0);

    return () => {
        forceUpdate(value => value + 1);
    }
}