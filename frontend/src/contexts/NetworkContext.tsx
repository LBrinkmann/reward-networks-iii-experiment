import React, {createContext, useContext, useEffect, useReducer} from "react";
import {StaticNetworkEdgeInterface} from "../components/Network/StaticNetwork/StaticNetwork";

const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';

export const NETWORK_ACTIONS = {
    NEXT_NODE: 'nextNode',
    TIMER_DONE: 'timerDone',
    DISABLE: 'disable',
}


export type NetworkState = {
    step: number;
    points: number;
    moves: number[];
    time: number;
    currentNode: number;
    possibleMoves: number[];
    isNetworkDisabled: boolean;
}

export type NetworkContextType = {
    networkState: NetworkState | null;
    networkDispatcher: (action: any) => void;
};


export const NetworkContext = createContext<NetworkContextType | null>(null);


const NetworkContextProvider = ({children}: any) => {
    const [networkState, networkDispatcher] = useReducer(reducer, {
        step: 0,
        points: 0,
        moves: [],
        time: 0,
        currentNode: 0,
        possibleMoves: [],
        isNetworkDisabled: false,
    });
    // JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY))

    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_NETWORK_STATE_KEY, JSON.stringify(networkState));
    // }, [networkState]);


    return (
        <NetworkContext.Provider value={{networkState, networkDispatcher}}>
            {children}
        </NetworkContext.Provider>
    );
};

const reducer = (state: NetworkState, action: any) => {
    switch (action.type) {
        case NETWORK_ACTIONS.NEXT_NODE:
            const possibleMoves = selectPossibleMoves(action.payload.edges, state.currentNode);

            if (possibleMoves.includes(action.payload.nodeIdx)) {
                return {
                    ...state,
                    currentNode: action.payload.nodeIdx,
                    moves: state.moves.concat([action.payload.nodeIdx]),
                    points: state.points + action.payload.reward,
                    step: state.step + 1,
                }
            } else return state;
        case NETWORK_ACTIONS.DISABLE:
            return {
                ...state,
                isNetworkDisabled: true,
            }
        default:
            return state;
    }
}

const selectPossibleMoves = (allEdges: StaticNetworkEdgeInterface[], currentNodeId: number) => {
    return allEdges
        .filter((edge) => edge.source_num === currentNodeId)
        .map((edge) => edge.target_num);
}

export default NetworkContextProvider;

export const useNetworkContext = () => useContext(NetworkContext);
