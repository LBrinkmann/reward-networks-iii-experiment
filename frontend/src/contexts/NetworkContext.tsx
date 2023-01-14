import React, {createContext, useContext, useEffect, useReducer} from "react";
import {
    StaticNetworkEdgeInterface,
    StaticNetworkNodeInterface
} from "../components/Network/StaticNetwork/StaticNetwork";
import networkReducer from "../reducers/NetworkReducer";

const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';


export type NetworkState = {
    network: { edges: StaticNetworkEdgeInterface[], nodes: StaticNetworkNodeInterface[] } | undefined;
    step: number;
    points: number;
    moves: number[];
    time: number;
    currentNode: number;
    possibleMoves: number[];
    isNetworkDisabled: boolean;
    isNetworkFinished: boolean;
}

export type NetworkContextType = {
    networkState: NetworkState | null;
    networkDispatcher: (action: any) => void;
};


const NetworkContext = createContext<NetworkContextType | null>(null);

const networkInitialState: NetworkState = {
    step: 0,
    points: 0,
    moves: [],
    time: 0,
    currentNode: undefined,
    possibleMoves: undefined,
    isNetworkDisabled: false,
    network: undefined,
    isNetworkFinished: false,
}

const networkInitializer = (initialState: NetworkState) => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY)) || initialState;
}

export const NetworkContextProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(networkReducer, networkInitialState, networkInitializer);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_NETWORK_STATE_KEY, JSON.stringify(state));
    }, [state]);

    return (
        <NetworkContext.Provider value={{networkState: state, networkDispatcher: dispatch}}>
            {children}
        </NetworkContext.Provider>
    );
};


const useNetworkContext = () => useContext(NetworkContext);

export default useNetworkContext;