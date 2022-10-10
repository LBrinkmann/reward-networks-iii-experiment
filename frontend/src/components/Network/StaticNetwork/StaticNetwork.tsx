import React from "react";
import NetworkNode from "../NetworkNode";
import NetworkEdge from "../NetworkEdge";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";
import { Node, Edge } from "../../../apis/apiTypes";

export interface StaticNetworkEdgeInterface extends Edge {
    reward: number;
    source_num: number;
    target_num: number;
    /** Edge style */
    edgeStyle?: NetworkEdgeStyle;
    arc_type: string;
    source_x: number;
    source_y: number;
    arc_x: number;
    arc_y: number;
    target_x: number;
    target_y: number;
}

export interface StaticNetworkNodeInterface extends Node {
    /** Node index, fetched from backend */
    node_num: number;
    /** Node displayed name, fetched from backend */
    display_name: string;
    /** Node x position */
    x: number;
    /** Node y position */
    y: number;
    starting_node?: boolean;
    /** Node level (property of the task solution strategy),
     * fetched from backend */
    level: number;
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
        size = 470,
        nodeSize = 20,
        edgeWidth = 2.5,
        showRewardText = false,
    }: StaticNetworkInterface) => {

    // Scale node coordinates
    const multiplier = 2;
    const scaleSizeX = (val: number) => val * multiplier + size / 2;
    const scaleSizeY = (val: number) => val * multiplier + size / 2;

    return (
        <svg width={size} height={size}>
            <g>
                {edges.map((edge: StaticNetworkEdgeInterface, idx: number) => {
                    return (
                        <NetworkEdge
                            reward={edge.reward}
                            edgeWidth={edgeWidth}
                            edgeStyle={edge.edgeStyle}
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
                            Radius={nodeSize}
                            onNodeClick={onNodeClickHandler}
                            isActive={(node.starting_node && currentNodeId === idx) || (currentNodeId === idx)}
                            isValidMove={possibleMoves.includes(idx)}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

export default StaticNetwork;