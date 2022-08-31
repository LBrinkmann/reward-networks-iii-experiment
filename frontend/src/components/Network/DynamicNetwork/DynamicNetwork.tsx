import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";

export interface DynamicNetworkInterface {
    nodes: StaticNetworkNodeInterface[];
    edges: StaticNetworkEdgeInterface[];
}

export interface MovesInterface {
    /** All possible valid nodes to choose */
    possibleMoves: number[];
    /** List of all moves */
    previousMoves: number[];
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = ({nodes, edges}: DynamicNetworkInterface) => {
    // get starting node
    const startingNode = nodes.filter(node => node.is_starting)[0];

    const [currentNodeInx, setCurrentNodeInx] = useState<number>(startingNode.node_num);
    const [moves, setMoves] = useState<MovesInterface>({possibleMoves: [], previousMoves: []});

    useEffect(() => {
        setMoves((moves: MovesInterface) => ({
                possibleMoves: selectPossibleMoves(edges, currentNodeInx),
                previousMoves: moves.previousMoves.concat([currentNodeInx])
            })
        );
        console.log(moves);
    }, [currentNodeInx]);


    // select edges starting from the node with the `currentNodeId` index
    const selectPossibleMoves = (allEdges: StaticNetworkEdgeInterface[], currentNodeId: number) => {
        return allEdges
            .filter((edge) => edge.source_num === currentNodeId)
            .map((edge) => edge.target_num);
    }

    const onNodeClickHandler = (nodeIdx: number) => {
        // check if node is in the possible moves list
        if (moves.possibleMoves.includes(nodeIdx)) {
            setCurrentNodeInx(nodeIdx);
        }
    }

    return (
        <StaticNetwork
            edges={edges}
            nodes={nodes}
            currentNodeId={currentNodeInx}
            possibleMoves={moves.possibleMoves}
            onNodeClickHandler={onNodeClickHandler}
        />
    )
}


export default DynamicNetwork;