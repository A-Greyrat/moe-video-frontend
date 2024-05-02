import State from "./State";
import React from "react";

type Func = <T extends unknown[]>(...value: T) => unknown;

class Store {
    private states: Map<string, State>;
    private subscriber: Map<State, Func[]>;
    private static instance: Store;

    public static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    private constructor() {
        this.states = new Map();
        this.subscriber = new Map();
    }

    public addState(stateName: string, value: React.MutableRefObject<unknown>) {
        const state: State = new State(value);

        this.states.set(stateName, state);
        this.subscriber.set(state, []);

        return state;
    }

    public getState(name: string) {
        return this.states.get(name);
    }

    public subscribe(state: State, listener: Func) {
        const subscriber: Func[] = this.subscriber.get(state) ?? [];
        subscriber.push(listener);
        this.subscriber.set(state, subscriber);

        return () => {
            const subscriber = this.subscriber.get(state);
            if (subscriber) {
                this.subscriber.set(state, subscriber.filter(subscriber => subscriber !== listener));
            }
        };
    }

    public publish(state: State) {
        const subscriber = this.subscriber.get(state) ?? [];
        subscriber.forEach(subscriber => subscriber(state.getValue()));
    }

    public updateState<T>(name: string, value: T) {
        const state = this.states.get(name);

        if (state) {
            state.setValue<T>(value);
            this.publish(state);
        }
    }
}

export default Store.getInstance();
