import React, {createContext, useContext, useEffect, useReducer} from "react";
import {
    StaticNetworkEdgeInterface,
    StaticNetworkNodeInterface
} from "../components/Network/StaticNetwork/StaticNetwork";

const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';

export const NETWORK_ACTIONS = {
    SET_NETWORK: 'setNetwork',
    NEXT_NODE: 'nextNode',
    TIMER_DONE: 'timerDone',
    DISABLE: 'disable',
}


export type NetworkState = {
    network: { edges: StaticNetworkEdgeInterface[], nodes: StaticNetworkNodeInterface[] } | undefined;
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
    const [state, dispatch] = useReducer(networkReducer, {
        step: 0,
        points: 0,
        moves: [],
        time: 0,
        currentNode: undefined,
        possibleMoves: undefined,
        isNetworkDisabled: false,
        network: undefined,
    });
    // JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY))

    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_NETWORK_STATE_KEY, JSON.stringify(networkState));
    // }, [networkState]);

    return (
        <NetworkContext.Provider value={{networkState: state, networkDispatcher: dispatch}}>
            {children}
        </NetworkContext.Provider>
    );
};

const networkReducer = (state: NetworkState, action: any) => {
    console.log('reducer', state, action);
    switch (action.type) {
        case NETWORK_ACTIONS.SET_NETWORK:
            const {edges, nodes} = action.payload.network;
            const startNode = nodes.filter((node: StaticNetworkNodeInterface) => node.starting_node)[0].node_num;
            const possibleMoves = selectPossibleMoves(edges, startNode);

            return {
                ...state,
                network: action.payload.network,
                currentNode: startNode,
                possibleMoves: possibleMoves,
                moves: [startNode],
            }
        case NETWORK_ACTIONS.TIMER_DONE:
                return {
                    ...state,
                    isNetworkDisabled: true,
                }

        case NETWORK_ACTIONS.NEXT_NODE:
            const nextNode = action.payload.nodeIdx;
            if (state.possibleMoves.includes(nextNode)) {
                const currentEdge = state.network.edges.filter(
                    (edge: any) => edge.source_num === state.currentNode && edge.target_num === nextNode)[0];

                return {
                    ...state,
                    currentNode: nextNode,
                    moves: state.moves.concat([nextNode]),
                    points: state.points + currentEdge.reward,
                    step: state.step + 1,
                    possibleMoves: selectPossibleMoves(state.network.edges, nextNode),
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
