import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdges, StaticNetworkInterface} from "../StaticNetwork/StaticNetwork";

export interface DynamicNetworkInterface extends StaticNetworkInterface {
    startNode: number;
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = ({...props}: DynamicNetworkInterface) => {
    // select edges starting from the node
    const selectCurrentEdges = (allEdges: StaticNetworkEdges[], currentNodeId: number) => {
        return allEdges.filter((edge) => edge.source_num === currentNodeId);
    }

    const [nodes, setNodes] = useState(props.nodes);
    const [edges, setEdges] = useState(props.edges);
    const [currentEdges, setCurrentEdges] = useState(selectCurrentEdges(props.edges, props.startNode));
    const [currentNodeInx, setCurrentNodeInx] = useState(props.startNode);

    const updateNodes = (currentNodeInx: number, validMove: boolean) => {
        // update node status
        setNodes(nodes.map((node, idx) => {
            if (node.node_num === currentNodeInx && validMove) {
                return {...node, status: 'active'};
            } else if (node.node_num === currentNodeInx && !validMove) {
                return {...node, status: 'invalid-click'};
            } else {
                return {...node, status: ''};
            }
        }));
    }

    useEffect(() => {
        updateNodes(currentNodeInx, true);
        setCurrentEdges(selectCurrentEdges(edges, currentNodeInx));
        console.log("currentNode", currentNodeInx);
        console.log("currentEdges", currentEdges);
    }, [currentNodeInx]);


    const onNodeClick = (nodeIdx: number) => {
        // check if node is in the current edges targets list
        if (currentEdges.find((edge) => edge.target_num === nodeIdx)) {
            setCurrentNodeInx(nodeIdx);
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