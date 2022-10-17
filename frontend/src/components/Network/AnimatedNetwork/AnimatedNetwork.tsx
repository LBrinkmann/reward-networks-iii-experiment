import React, {FC, useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";

export interface AnimatedNetworkInterface {
    /** Array of nodes of the network */
    nodes: StaticNetworkNodeInterface[];
    /** Array of edges of the network */
    edges: StaticNetworkEdgeInterface[];
    /** The list of moves with the starting node as the first element */
    moves: number[];
    /** Delay in ms between each played move. Default is 1000ms. */
    delayBetweenMoves?: number;
    /** Hook to handle parent states on new step */
    onNextStepHandler?: (currentNode: number, nextNode: number) => void;
    /** Start the animation from the parent component. Default is true. */
    playAnimation?: boolean;
}

const AnimatedNetwork: FC<AnimatedNetworkInterface> = (props: AnimatedNetworkInterface) => {
    const {moves, playAnimation = true, delayBetweenMoves = 1000} = props;

    const [currentMoveInx, setCurrentMoveInx] = useState<number>(0);
    const [edges, setEdges] = useState<StaticNetworkEdgeInterface[]>(props.edges);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const m = JSON.parse(window.localStorage.getItem('currentMoveInx'))
        if (m) {
            setCurrentMoveInx(m);
            setEdges(updateEdges(moves[m], moves[m + 1]));
        }
    }, []);

    useEffect(() => {
        if (playAnimation) {
            setTimeout(() => {
                if (currentMoveInx < moves.length) {
                    setEdges(updateEdges(moves[currentMoveInx], moves[currentMoveInx + 1]));

                    // save states to local storage to prevent losing state on refresh
                    window.localStorage.setItem('currentMoveInx', JSON.stringify(currentMoveInx));

                    props.onNextStepHandler(moves[currentMoveInx], moves[currentMoveInx + 1]);
                    setCurrentMoveInx(currentMoveInx + 1);
                }
            }, delayBetweenMoves);
        }
    }, [playAnimation, currentMoveInx]);

    // Highlight the edge between the current node and the next node
    const updateEdges = (sourceInx: number, targetInx: number) => {
        return edges.map((edge: StaticNetworkEdgeInterface) => {
            if (edge.source_num === sourceInx && edge.target_num === targetInx) {
                return {...edge, edgeStyle: "highlighted" as NetworkEdgeStyle};
            } else {
                return {...edge, edgeStyle: "normal" as NetworkEdgeStyle};
            }
        });
    }

    return (
        <StaticNetwork
            edges={edges}
            nodes={props.nodes}
            currentNodeId={moves[currentMoveInx]}
            possibleMoves={[]}
            size={460}
            onNodeClickHandler={null}
        />
    )
}


export default AnimatedNetwork;