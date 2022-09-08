import React from "react";
import NetworkNode from "../NetworkNode";
import NetworkEdge from "../NetworkEdge";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";

export interface StaticNetworkEdgeInterface {
    reward: number;
    source_num: number;
    target_num: number;
    /** Edge style */
    edgeStyle: NetworkEdgeStyle;
}

export interface StaticNetworkNodeInterface {
    /** Node index, fetched from backend */
    node_num: number;
    /** Node displayed name, fetched from backend */
    display_name: string;
    /** Node x position */
    x: number;
    /** Node y position */
    y: number;
    is_starting: boolean;
    /** Node level (property of the task solution strategy),
     * fetched from backend */
    level?: number;
}


export interface StaticNetworkInterface {
    /** Array of edges of the network */
    edges: StaticNetworkEdgeInterface[];
    /** Array of nodes of the network */
    nodes: StaticNetworkNodeInterface[];
    /** Callback function to be called when a node is clicked */
    onNodeClickHandler: (nodeIdx: number) => void;
    /** Current active node */
    currentNodeId: number;
    /** Node indices that could be potential next move (have connection through edge) */
    possibleMoves: number[];
    /** size of the SVG component */
    size?: { width: number; height: number };
    /** Show reward text on the edges */
    showRewardText?: boolean;
    nodeSize?: number;
    edgeCurvation?: number;
    edgeWidth?: number;
}

const StaticNetwork: React.FC<StaticNetworkInterface> = (
    {
        edges,
        nodes,
        onNodeClickHandler,
        currentNodeId=null,
        possibleMoves = [],
        size = {width: 550, height: 550},
        edgeCurvation = 1,
        nodeSize = 20,
        edgeWidth = 1,
        showRewardText = false,
    }: StaticNetworkInterface) => {

    // Scale node coordinates
    const scaleXY = (
        node: { x: number; y: number },
        size: { width: number; height: number }
    ) => ({
        x: node.x * size.width,
        y: node.y * size.height,
    });

    const transformedNodes = nodes.map((node: StaticNetworkNodeInterface) => ({
        ...node,
        ...scaleXY(node, size),  // scaled coordinates
    } as StaticNetworkNodeInterface));

    return (
        <svg width={size.width} height={size.height}>
            <g>
                {edges.map((edge: StaticNetworkEdgeInterface, idx: number) => {
                    return (
                        <NetworkEdge
                            reward={edge.reward}
                            source={transformedNodes[edge.source_num]}
                            target={transformedNodes[edge.target_num]}
                            edgeWidth={edgeWidth}
                            edgeCurvation={edgeCurvation}
                            edgeStyle={edge.edgeStyle}
                            key={"edge-" + idx}
                            idx={idx}
                            nodeSize={nodeSize}
                            showRewardText={showRewardText}
                        />
                    );
                })}
            </g>
            <g>
                {transformedNodes.map((node: StaticNetworkNodeInterface, idx: number) => {
                    return (
                        <NetworkNode
                            x={node.x}
                            y={node.y}
                            nodeInx={node.node_num}
                            Text={node.display_name}
                            Size={nodeSize}
                            onNodeClick={onNodeClickHandler}
                            isActive={(node.is_starting && currentNodeId === idx) || (currentNodeId === idx)}
                            isValidMove={possibleMoves.includes(idx)}
                            key={"node-" + idx}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

export default StaticNetwork;