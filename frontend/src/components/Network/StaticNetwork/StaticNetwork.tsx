import React from "react";

import NetworkNode from "../NetworkNode";
import {NetworkNodeInterface} from "../NetworkNode/NetworkNode";

import NetworkEdge from "../NetworkEdge";

export interface Size {
    width: number;
    height: number;
}

interface StaticNetworkInterface {
    edges: { reward: number; source_num: number; target_num: number }[];
    nodes: NetworkNodeInterface[];
    onNodeClick?: (nodeIdx: number) => void;
    size?: Size;
    nodeSize?: number;
    networkId?: string;
    linkCurvation?: number;
    linkWidth?: number;
}

const StaticNetwork = ({
                           edges,
                           nodes,
                           onNodeClick = (nodeIdx) => null,
                           size = {width: 550, height: 550},
                           networkId = "default",
                           linkCurvation,
                           nodeSize = 40,
                           linkWidth = 5,
                       }: StaticNetworkInterface) => {
    /* TODO: make it more generic */
    // const nodeSize = ((size.height / 550) * 600) / 15;

    /* Scale node coordinates */
    const scaleXY = (
        node: { x: number; y: number },
        size: { width: number; height: number }
    ) => ({
        x: node.x * size.width,
        y: node.y * size.height,
    });

    const scaledNodes = nodes.map((node) => ({
        ...node,
        ...scaleXY(node, size),  // scaled coordinates
        // ... () => {node.node_size ? node.node_size : ((size.height / 550) * 600) / 15},
    } as NetworkNodeInterface));

    return (
        <svg width={size.width} height={size.height}>
            <g>
                {edges.map((edge, idx) => {
                    return (
                        <NetworkEdge
                            reward={edge.reward}
                            source={scaledNodes[edge.source_num]}
                            target={scaledNodes[edge.target_num]}
                            edgeWidth={linkWidth}
                            linkCurvation={linkCurvation}
                            key={"link-" + idx}
                            networkId={networkId}
                            idx={idx}
                            nodeSize={nodeSize}
                            // linkStyle={edge.linkStyle}
                        />
                    );
                })}
            </g>
            <g>
                {scaledNodes.map((node, idx) => {
                    return (
                        <NetworkNode
                            {...node}
                            node_size={nodeSize}
                            onNodeClick={onNodeClick}
                            key={"point-" + idx}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

export default StaticNetwork;