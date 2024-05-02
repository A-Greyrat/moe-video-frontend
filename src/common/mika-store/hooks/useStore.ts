import {useCallback, useEffect, useRef} from "react";
import Store from "../Store";
import useForceUpdate from "./useForceUpdate";

/**
 * A React hook that provides a way to interact with a global state.
 *
 * @template T The type of the state.
 * @param {string} name The name of the state.
 * @param {T} [value] The initial value of the state.
 * @returns {readonly [T, (newValue: T) => void]} A tuple containing the state and a function to update the state.
 */
const useStore = <T, >(name: string, value?: T): readonly [T, (newValue: T) => void] => {
    const forceUpdate = useForceUpdate();

    const state = useRef<T | null | undefined>(null);
    const unsubscribe = useRef<() => void>();
    const storedState = useRef(Store.getState(name));

    // If the state does not exist, create a new state and subscribe to it.
    // Otherwise, just subscribe to the existing state.
    if (state.current === null) {
        state.current = value;

        !storedState.current && (storedState.current = Store.addState(name, state));
        unsubscribe.current = Store.subscribe(storedState.current!, forceUpdate);
    }

    // Unsubscribe from the state when the component unmounts.
    useEffect(() => {
        return () => {
            unsubscribe.current?.();
        };
    }, []);

    const setState = useCallback((newValue: T) => Store.updateState<T>(name, newValue), [name]);

    return [storedState.current!.getValue<T>(), setState] as const;
}

export default useStore;