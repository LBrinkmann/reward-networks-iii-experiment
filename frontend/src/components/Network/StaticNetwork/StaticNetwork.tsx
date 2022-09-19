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
    arc_type: 'straight' | 'curved';
    source_x: number;
    source_y: number;
    arc_x: number;
    arc_y: number;
    target_x: number;
    target_y: number;
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
    size?: number;
    /** Show reward text on the edges */
    showRewardText?: boolean;
    nodeSize?: number;
    edgeWidth?: number;
}

const StaticNetwork: React.FC<StaticNetworkInterface> = (
    {
        edges,
        nodes,
        onNodeClickHandler,
        currentNodeId=null,
        possibleMoves = [],
        size = 400,
        nodeSize = 18,
        edgeWidth = 2,
        showRewardText = false,
    }: StaticNetworkInterface) => {

    // Scale node coordinates
    const scaleXY = (
        node: { x: number; y: number },
        size: number
    ) => ({
        x: node.x * (size / 4) + size / 2,
        y: node.y * (size / 4) + size / 2,
    });

    const scaleSizeX = (val: number) => (val + 100) * 1.5 + size / 2 - 100 * 1.5;
    const scaleSizeY = (val: number) => (-1 * val + 100) * 1.5 + size / 2 - 100 * 1.5;

    return (
        <svg width={size} height={size}>
            <g>
                {edges.map((edge: StaticNetworkEdgeInterface, idx: number) => {
                    return (
                        <NetworkEdge
                            reward={edge.reward}
                            edgeWidth={edgeWidth}
                            edgeStyle={edge.edgeStyle}
                            key={"edge-" + idx}
                            idx={idx}
                            showRewardText={showRewardText}
                            arc_type={edge.arc_type}
                            source_x={scaleSizeX(edge.source_x)}
                            source_y={scaleSizeY(edge.source_y)}
                            arc_x={scaleSizeX(edge.arc_x)}
                            arc_y={scaleSizeY(edge.arc_y)}
                            target_x={scaleSizeX(edge.target_x)}
                            target_y={scaleSizeY(edge.target_y)}
                        />
                    );
                })}
            </g>
            <g>
                {nodes.map((node: StaticNetworkNodeInterface, idx: number) => {
                    return (
                        <NetworkNode
                            x={scaleSizeX(node.x)}
                            y={scaleSizeY(node.y)}
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