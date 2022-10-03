import React, {FC} from "react"
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import NetworkNode from "../NetworkNode";
import NetworkEdge from "../NetworkEdge";

interface LinearSolutionInterface {
    /** Array of nodes of the network */
    nodes: StaticNetworkNodeInterface[];
    /** Array of edges of the network */
    edges: StaticNetworkEdgeInterface[];
    /** The list of moves with the starting node as the first element */
    moves: number[];
    /** Size of the SVG component. Default width = 700, height = 100 */
    size?: { width: number, height: number };
    /** Node size. Default = 25 */
    nodeRadius?: number;
    /** Gap between nodes. Default = 80 */
    gap?: number;
    /** Onset of the first node. Default = 100 */
    onset?: number;
}


export const LinearSolution: FC<LinearSolutionInterface> = (props) => {
    const {size = {width: 800, height: 100}, nodeRadius = 20, gap = 70, onset = 100, nodes, edges, moves} = props;

    const plotEdge = (moveIdx: number) => {
        if (moveIdx < moves.length - 1) {
            const edge = edges.filter((edge) =>
                edge.source_num === moves[moveIdx] && edge.target_num === moves[moveIdx + 1])[0];

            // the point on the border of the source node
            const sourceX = onset + moveIdx * gap + nodeRadius;
            // the point on the border of the target node
            const targetX = onset + (moveIdx + 1) * gap - nodeRadius;

            return (
                <NetworkEdge
                    reward={edge.reward}
                    edgeWidth={2}
                    edgeStyle={edge.edgeStyle}
                    key={"edge-" + moveIdx}
                    idx={moveIdx}
                    showRewardText={false}
                    arc_type={edge.arc_type}
                    source_x={sourceX}
                    source_y={size.height / 2}
                    arc_x={sourceX + (targetX - sourceX)}
                    arc_y={size.height / 2}
                    target_x={targetX}
                    target_y={size.height / 2}
                />
            );
        } else {
            return null;
        }
    }

    return (
        <svg width={size.width} height={size.height}>
            <g>
                {moves.map((move, idx) => {
                    const node = nodes[move];
                    return (
                        <>
                            <NetworkNode
                                x={onset + idx * gap}
                                y={size.height / 2}
                                nodeInx={node.node_num}
                                Text={node.display_name}
                                Radius={nodeRadius}
                                onNodeClick={() => null}
                                isActive={false}
                                isValidMove={false}
                                key={"node-" + idx}
                            />
                            {plotEdge(idx)}
                        </>
                    );
                })};
            </g>

        </svg>
    )
}

export default LinearSolution