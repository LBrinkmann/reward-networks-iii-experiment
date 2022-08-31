import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgesInterface, StaticNetworkInterface} from "../StaticNetwork/StaticNetwork";
import {NetworkNodeInterface} from "../NetworkNode/NetworkNode";

export interface DynamicNetworkInterface extends StaticNetworkInterface {
    startNode: number;
}

const DynamicNetwork: React.FC<DynamicNetworkInterface> = ({...props}: DynamicNetworkInterface) => {
    // select edges starting from the node
    const selectCurrentEdges = (allEdges: StaticNetworkEdgesInterface[], currentNodeId: number) => {
        return allEdges.filter((edge) => edge.source_num === currentNodeId);
    }

    const [nodes, setNodes] = useState<NetworkNodeInterface[]>(props.nodes);
    const [edges, setEdges] = useState<StaticNetworkEdgesInterface[]>(props.edges);
    const [currentEdges, setCurrentEdges] = useState<StaticNetworkEdgesInterface[]>(
        selectCurrentEdges(props.edges, props.startNode));
    const [currentNodeInx, setCurrentNodeInx] = useState<number>(props.startNode);

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