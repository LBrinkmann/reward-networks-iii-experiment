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
    /** show tutorial tip */
    showNodeTutorial?: boolean;
    /** show tutorial tip */
    showEdgeTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
    /** all rewards */
    allRewards?: number[];
}

export interface MovesInterface {
    /** All possible valid nodes to choose */
    possibleMoves: number[];
    /** List of all moves */
    previousMoves: number[];
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = props => {
    const {
        nodes,
        edges,
        onNodeClickParentHandler,
        isDisabled = false,
        allRewards = [-100, -20, 0, 20, 140]
    } = props;

    // get starting node
    const startingNode = nodes.filter(node => node.starting_node)[0];

    const [currentNodeInx, setCurrentNodeInx] = useState<number>(startingNode.node_num);
    const [moves, setMoves] = useState<MovesInterface>({possibleMoves: [], previousMoves: []});

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const n = JSON.parse(window.localStorage.getItem('currentNodeInx'))
        if (n) setCurrentNodeInx(n);
        const m = JSON.parse(window.localStorage.getItem('movesDynamicNetwork'))
        if (m) setMoves(m);
    }, []);

    useEffect(() => {
        setMoves((moves: MovesInterface) => ({
                possibleMoves: selectPossibleMoves(edges, currentNodeInx),
                previousMoves: moves.previousMoves.concat([currentNodeInx])
            })
        );
        // save states to local storage to prevent losing state on refresh
        window.localStorage.setItem('currentNodeInx', JSON.stringify(currentNodeInx));
        window.localStorage.setItem('movesDynamicNetwork', JSON.stringify(moves));
    }, [currentNodeInx, props.nodes, props.edges]);


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
            onNodeClickHandler={isDisabled ? null : onNodeClickHandler}
            allRewards={allRewards}
            {...props}
        />
    )
}


export default DynamicNetwork;