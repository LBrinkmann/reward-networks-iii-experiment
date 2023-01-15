import {
    StaticNetworkEdgeInterface,
    StaticNetworkNodeInterface
} from "../components/Network/StaticNetwork/StaticNetwork";
import {networkInitialState, NetworkState} from "../contexts/NetworkContext";

export const NETWORK_ACTIONS = {
    SET_NETWORK: 'setNetwork',
    NEXT_NODE: 'nextNode',
    TIMER_DONE: 'timerDone',
    DISABLE: 'disable',
    NEXT_TUTORIAL_STEP: 'nextTutorialStep',
}


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
                isNetworkDisabled: false,
                isNetworkFinished: false,
                // Tutorial
                isTutorial: action.payload.isTutorial,
                tutorialStep: action.payload.isTutorial ? 1 : networkInitialState.tutorialStep,
                tutorialOptions: action.payload.isTutorial ? {
                    ...networkInitialState.tutorialOptions,
                    node: true
                } : networkInitialState.tutorialOptions,
            }
        case NETWORK_ACTIONS.TIMER_DONE:
            return {
                ...state,
                isNetworkDisabled: true,
                isNetworkFinished: true,
                currentNode: undefined,
            }

        case NETWORK_ACTIONS.NEXT_NODE:
            // if network is disabled or finished, do nothing
            if (state.isNetworkFinished || state.isNetworkDisabled) return state;

            const nextNode = action.payload.nodeIdx;
            const maxStep = action.payload?.maxSteps || 8;

            // if node is not in possible moves, do nothing
            if (!state.possibleMoves.includes(nextNode)) return state;

            // find the current edge
            const currentEdge = state.network.edges.filter(
                (edge: any) => edge.source_num === state.currentNode && edge.target_num === nextNode)[0];

            return {
                ...state,
                currentNode: nextNode,
                moves: state.moves.concat([nextNode]),
                points: state.points + currentEdge.reward,
                step: state.step + 1,
                possibleMoves: selectPossibleMoves(state.network.edges, nextNode),
                isNetworkDisabled: state.step + 1 >= maxStep,
                isNetworkFinished: state.step + 1 >= maxStep,
            }
        case NETWORK_ACTIONS.NEXT_TUTORIAL_STEP:
            if (!state.isTutorial) return state;

            if (state.tutorialStep === 1) {
                return {
                    ...state,
                    tutorialStep: state.tutorialStep + 1,
                    tutorialOptions: {...networkInitialState.tutorialOptions, edge: true},
                }
            }
            if (state.tutorialStep === 2) {
                return {
                    ...state,
                    tutorialStep: state.tutorialStep + 1,
                    tutorialOptions: {...networkInitialState.tutorialOptions, points: true},
                }
            }

            if (state.tutorialStep === 3 && !(state.moves.length >= 2 && state.moves.length < 3)) {

                return {
                    ...state,
                    tutorialStep: state.tutorialStep + 1,
                    tutorialOptions: {...networkInitialState.tutorialOptions, linearSolution: true},
                }
            }

            if (state.tutorialStep === 4 && !(state.moves.length >= 3 && state.moves.length < 9)) {

                return {
                    ...state,
                    tutorialStep: state.tutorialStep + 1,
                    tutorialOptions: {...networkInitialState.tutorialOptions, time: true},
                }
            }

            return {
                ...state,
                // clear tutorial options
                tutorialOptions: networkInitialState.tutorialOptions,
            };


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


export default networkReducer;