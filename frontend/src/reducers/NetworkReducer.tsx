import {
    StaticNetworkEdgeInterface,
    StaticNetworkNodeInterface
} from "../components/Network/StaticNetwork/StaticNetwork";
import {networkInitialState, NetworkState} from "../contexts/NetworkContext";

export const NETWORK_ACTIONS = {
    SET_NETWORK: 'setNetwork',
    NEXT_NODE: 'nextNode',
    TIMER_UPDATE: 'timeUpdate',
    DISABLE: 'disable',
    NEXT_TUTORIAL_STEP: 'nextTutorialStep',
    FINISH_COMMENT_TUTORIAL: 'finishCommentTutorial',
    HIGHLIGHT_EDGE_TO_CHOOSE: 'highlightEdgeToRepeat',
    RESET_EDGE_STYLES: 'resetEdgeStyles',
}


const networkReducer = (state: NetworkState, action: any) => {
    switch (action.type) {
        case NETWORK_ACTIONS.SET_NETWORK:
            const {edges, nodes} = action.payload.network;
            const startNode = nodes.filter((node: StaticNetworkNodeInterface) => node.starting_node)[0].node_num;
            const possibleMoves = selectPossibleMoves(edges, startNode);

            return {
                ...networkInitialState,
                network: action.payload.network,
                currentNode: startNode,
                possibleMoves: possibleMoves,
                moves: [startNode],
                isNetworkDisabled: false,
                isNetworkFinished: false,
                // Tutorial
                isPractice: action.payload.isPractice,
                tutorialStep: action.payload.isPractice ? 1 : networkInitialState.tutorialStep,
                tutorialOptions: {
                    ...networkInitialState.tutorialOptions,
                    node: action.payload.isPractice,
                    comment: action.payload.commentTutorial,
                },
                teacherComment: action.payload.teacherComment,
            }
        case NETWORK_ACTIONS.TIMER_UPDATE:
            // if timer is done
            if (action.payload.time === state.timer.timePassed) {
                return {
                    ...state,
                    isNetworkDisabled: true,
                    isNetworkFinished: true,
                    currentNode: undefined,
                    timer: {
                        ...state.timer,
                        isTimerDone: true,
                    }
                };
            }
            // if timer is paused
            if (action.payload.paused) return {
                ...state,
                timer: {
                    ...state.timer,
                    isTimerPaused: true,
                }
            };

            // if timer is not done
            return {
                ...state,
                timer: {
                    ...state.timer,
                    timePassed: state.timer.timePassed + 1,
                }
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
            if (!state.isPractice) return state;

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
        case NETWORK_ACTIONS.FINISH_COMMENT_TUTORIAL:
            return {
                ...state,
                tutorialOptions: {...state.tutorialOptions, comment: false},
            }
        case NETWORK_ACTIONS.DISABLE:
            return {
                ...state,
                isNetworkDisabled: true,
            }
        case NETWORK_ACTIONS.HIGHLIGHT_EDGE_TO_CHOOSE:
            const {source, target, edgeStyle} = action.payload;
            const edgeToFollow = state.network.edges.filter(
                (edge: StaticNetworkEdgeInterface) => edge.source_num === source && edge.target_num === target)[0];

            // set all edges to default style
            state.network.edges.forEach((edge: StaticNetworkEdgeInterface) => edge.edgeStyle = "normal");

            if (edgeToFollow) {
                edgeToFollow.edgeStyle = edgeStyle;
                return {...state, possibleMoves: [target],}
            } else
                return state;
        case NETWORK_ACTIONS.RESET_EDGE_STYLES:
            const resetEdges = state.network.edges;
            resetEdges.forEach((edge: any) => edge.edgeStyle = "normal");
            return {...state, network: {...state.network, edges: resetEdges}};
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