import React, {createContext, useContext, useEffect, useState} from "react";

const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';

export type NetworkState = {
    step: number;
    points: number;
    moves: number[];
    time: number;
    currentNode: number;
    tutorialId?: number;
}

export type NetworkContextType = {
    networkState: NetworkState | null;
    updateNetworkState: (newNetworkState: NetworkState) => void;
};


export const NetworkContext = createContext<NetworkContextType | null>(null);


const NetworkContextProvider = ({children}: any) => {
    const [networkState, setNetworkState] = useState<NetworkState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY))
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_NETWORK_STATE_KEY, JSON.stringify(networkState));
    }, [networkState]);


    const updateNetworkState = (newNetworkState: NetworkState) => setNetworkState(newNetworkState)


    return (
        <NetworkContext.Provider value={{networkState, updateNetworkState}}>
            {children}
        </NetworkContext.Provider>
    );
};

export default NetworkContextProvider;

export const useNetworkContext = () => useContext(NetworkContext);
