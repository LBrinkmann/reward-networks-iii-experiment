import React from "react";
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
        allRewards = [-100, -20, 0, 20, 140]
    } = props;

    // Scale node coordinates
    const multiplier = 2;
    const scaleSizeX = (val: number) => val * multiplier + size / 2;
    const scaleSizeY = (val: number) => val * multiplier + size / 2;

    let colors = [
        '#7b3294',
        '#c2a5cf',
        '#f7f7f7',
        '#a6dba0',
        '#008837',
    ]

    // see https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
    function lerpColor(a: string, b: string, amount: number) {

        const ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    function interpolateColors(startColor: string, endColor: string, numColors: number): string[] {
        let interpolatedColors = [];
        let interval = 1 / (numColors - 1);

        // Interpolate colors from start to middle
        for (let i = 0; i < numColors; i++) {
            let amount = i * interval;
            interpolatedColors.push(lerpColor(startColor, endColor, amount));
        }
        return interpolatedColors;
    }

    // interpolate colors
    if (allRewards.length !== colors.length) {
        switch (allRewards.length) {
            case 2:
                colors = ['#7b3294', '#008837'];
                break;
            case 3:
                colors = ['#7b3294', '#f7f7f7', '#008837'];
                break;
            case 4:
                colors = ['#7b3294', '#c2a5cf', '#a6dba0', '#008837'];
                break;
            default:
                colors = interpolateColors('#c2a5cf', '#a6dba0', allRewards.length);
        }
    }

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
                                isActive={isActive}
                                isValidMove={possibleMoves.includes(node.node_num)}
                                key={'node-' + idx}
                                showTutorial={showNodeTutorial && isActive}
                                onTutorialClose={props.onTutorialClose}
                            />
                        );
                    })}
                </g>
            </g>
        </svg>
    );
};

export default StaticNetwork;