import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";

export interface DynamicNetworkInterface {
    nodes: StaticNetworkNodeInterface[];
    edges: StaticNetworkEdgeInterface[];
    /** Function to update parent state from child component */
    onNodeClickParentHandler?: (currentNode: number, nextNode: number) => void;
    /** Control weather subject can interact with the network */
    isDisabled?: boolean;
}

export interface MovesInterface {
    /** All possible valid nodes to choose */
    possibleMoves: number[];
    /** List of all moves */
    previousMoves: number[];
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = (
    {
        nodes,
        edges,
        onNodeClickParentHandler,
        isDisabled = false,
    }: DynamicNetworkInterface) => {

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
            onNodeClickParentHandler(currentNodeInx, nodeIdx);
            setCurrentNodeInx(nodeIdx);
        }
    }

    return (
        <StaticNetwork
            edges={edges}
            nodes={nodes}
            currentNodeId={currentNodeInx}
            possibleMoves={moves.possibleMoves}
            onNodeClickHandler={
                isDisabled ? null : onNodeClickHandler
            }
        />
    )
}


export default DynamicNetwork;