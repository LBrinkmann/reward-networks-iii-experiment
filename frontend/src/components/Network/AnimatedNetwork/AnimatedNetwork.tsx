import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkInterface} from "../StaticNetwork/StaticNetwork";

export interface AnimatedNetworkInterface extends StaticNetworkInterface {
    startNode: number;
}


const AnimatedNetwork = ({...props}: AnimatedNetworkInterface) => {
    const [nodes, setNodes] = useState(props.nodes);
    const [edges, setEdges] = useState(props.edges);
    const [currentNode, setCurrentNode] = useState(props.startNode);

    useEffect(() => {
        console.log("currentNode", currentNode);
        // TODO: validate moves
        setNodes(nodes.map((node, idx) => {
            if (idx === currentNode) {
                return {
                    ...node,
                    status: 'active',
                };
            }
            return {
                ...node,
                isCurrent: 'disabled',
            };
        }));
    }, [currentNode]);

    const onNodeClick = (nodeIdx: number) => {
        setCurrentNode(nodeIdx);
    }

    return (
        <StaticNetwork
            edges={edges}
            nodes={nodes}
            onNodeClick={onNodeClick}
        />
    )
}


export default AnimatedNetwork;