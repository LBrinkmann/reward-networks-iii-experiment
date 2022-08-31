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
    /** Current move (clicked node) */
    move: number;
    /** Is the current move valid? */
    isMoveValid: boolean;
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = ({...props}: DynamicNetworkInterface) => {
    const [nodes, setNodes] = useState<NetworkNodeInterface[]>(props.nodes);
    const [edges, setEdges] = useState<StaticNetworkEdgesInterface[]>(props.edges);
    const [currentNodeInx, setCurrentNodeInx] = useState<number>(props.startNode);
    const [moves, setMoves] = useState<MovesInterface>({possibleMoves: [], move: null, isMoveValid: null});

    useEffect(() => {
        setMoves((moves) => ({...moves, possibleMoves: selectPossibleMoves(edges,currentNodeInx)}));
        // Useful console logs for development
        console.log("currentNode", currentNodeInx);
        console.log("possibleMoves", selectPossibleMoves(edges, currentNodeInx));
    }, [currentNodeInx, edges]);

    // select edges starting from the node with the `currentNodeId` index
    const selectPossibleMoves = (allEdges: StaticNetworkEdgesInterface[], currentNodeId: number) => {
        return allEdges
            .filter((edge: StaticNetworkEdgesInterface) => edge.source_num === currentNodeId)
            .map((edge: StaticNetworkEdgesInterface) => edge.target_num);
    }

    // update nodes with the new status
    const updateNodes = (moveIdx: number, validMove: boolean) => {
        setNodes(nodes.map((node: NetworkNodeInterface) => {
            if (node.node_num === moveIdx && validMove) {
                return {...node, status: 'active'};
            } else if (node.node_num === moveIdx && !validMove) {
                return {...node, status: 'invalid-click'};
            } else if (node.node_num === currentNodeInx && !validMove) {
                // keep the current node active if the move is wrong
                return {...node, status: 'active'};
            } else {
                return {...node, status: ''};
            }
        }));
    }

    const onNodeClick = (nodeIdx: number) => {
        // check if node is in the possible moves list
        if (moves.possibleMoves.includes(nodeIdx)) {
            setCurrentNodeInx(nodeIdx);
            updateNodes(currentNodeInx, true);
        } else {
            // TODO: add timeout 500ms
            updateNodes(nodeIdx, false);
        }

    }

    return (
        <StaticNetwork
            edges={edges}
            nodes={nodes}
            onNodeClick={onNodeClick}
        />
    )
}


export default DynamicNetwork;