import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgesInterface, StaticNetworkInterface} from "../StaticNetwork/StaticNetwork";
import {NetworkNodeInterface} from "../NetworkNode/NetworkNode";

export interface DynamicNetworkInterface extends StaticNetworkInterface {
    startNode: number;
}

export interface MovesInterface {
    /** All possible valid nodes to choose */
    possibleMoves: number[];
    /** List of all moves */
    previousMoves: number[];
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = ({...props}: DynamicNetworkInterface) => {
    const [edges, setEdges] = useState<StaticNetworkEdgesInterface[]>(props.edges);
    const [currentNodeInx, setCurrentNodeInx] = useState<number>(props.startNode);
    const [moves, setMoves] = useState<MovesInterface>({possibleMoves: [], previousMoves: []});

    useEffect(() => {
        setMoves((moves: MovesInterface) => ({
                possibleMoves: selectPossibleMoves(edges, currentNodeInx),
                previousMoves: moves.previousMoves.concat([currentNodeInx])
            })
        );
    }, [currentNodeInx]);

    // select edges starting from the node with the `currentNodeId` index
    const selectPossibleMoves = (allEdges: StaticNetworkEdgesInterface[], currentNodeId: number) => {
        return allEdges
            .filter((edge: StaticNetworkEdgesInterface) => edge.source_num === currentNodeId)
            .map((edge: StaticNetworkEdgesInterface) => edge.target_num);
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
            nodes={props.nodes}
            currentNodeId={currentNodeInx}
            possibleMoves={moves.possibleMoves}
            onNodeClick={onNodeClickHandler}
        />
    )
}


export default DynamicNetwork;