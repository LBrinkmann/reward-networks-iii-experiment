import React, {useCallback} from "react";
import NetworkNode from "../NetworkNode";
import NetworkEdge from "../NetworkEdge";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";
import {Node, Edge} from "../../../apis/apiTypes";

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
    /** show tutorial tip */
    showNodeTutorial?: boolean;
    /** show tutorial tip */
    showEdgeTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
    /** Blur the network to hide it */
    blur?: boolean;
    /** Rewards range */
    allRewards?: number[];
    colors?: string[];
    disableClick?: boolean;
}

const StaticNetwork: React.FC<StaticNetworkInterface> = props => {
    const {
        edges,
        nodes,
        onNodeClickHandler,
        currentNodeId = null,
        possibleMoves = [],
        size = 470,
        nodeSize = 20,
        edgeWidth = 2.5,
        showRewardText = false,
        showNodeTutorial = false,
        showEdgeTutorial = false,
        blur = false,
        allRewards = [-50, 0, 100, 200, 400],
        colors = ['#c51b7d', '#e9a3c9', '#e6f5d0', '#a1d76a', '#4d9221',],
        disableClick = false,
    } = props;

    // Scale node coordinates
    const multiplier = 2;
    const scaleSizeX = (val: number) => val * multiplier + size / 2;
    const scaleSizeY = (val: number) => val * multiplier + size / 2;

    const setNodeStatus = useCallback((active: boolean, node_num: number) => {
        if (active) return 'active';
        if (disableClick || blur) return 'disabled';
        // if in possible moves return 'next'
        if (possibleMoves.includes(node_num)) return 'next';
        return 'normal';
    }, [possibleMoves, disableClick, blur]);

    const setNextNodeColor = useCallback((node_num: number) => {
        const reward = edges.find(edge => (edge.source_num === currentNodeId) && (edge.target_num === node_num))?.reward;
        // check if reward in not null
        return reward === null ? '#ffffff' : colors[allRewards.indexOf(reward)];
    }, [edges, currentNodeId, allRewards, colors]);

    return (
        <svg width={size} height={size}>
            <defs>
                <filter id="static-network-blur" x="0" y="0">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="7"/>
                </filter>
            </defs>
            {/* apply filter to the network to hide it if 'blur' is true */}
            <g filter={blur ? "url(#static-network-blur)" : ""}>
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
                                key={'edge-' + idx}
                                showTutorial={showEdgeTutorial && idx === 0}
                                onTutorialClose={null}  // No need for the OK button in the tooltip
                                color={colors[allRewards.indexOf(edge.reward)]}
                            />
                        );
                    })}
                </g>
                <g>
                    {nodes.map((node: StaticNetworkNodeInterface, idx: number) => {
                        const isActive = currentNodeId === node.node_num;
                        return (
                            <NetworkNode
                                x={scaleSizeX(node.x)}
                                y={scaleSizeY(node.y)}
                                nodeInx={node.node_num}
                                Text={node.display_name}
                                Radius={nodeSize}
                                onNodeClick={onNodeClickHandler}
                                status={setNodeStatus(isActive, node.node_num)}
                                isValidMove={possibleMoves.includes(node.node_num)}
                                key={'node-' + idx}
                                showTutorial={showNodeTutorial && isActive}
                                onTutorialClose={props.onTutorialClose}
                                nextNodeColor={setNextNodeColor(node.node_num)}
                            />
                        );
                    })}
                </g>
            </g>
        </svg>
    );
};

export default StaticNetwork;