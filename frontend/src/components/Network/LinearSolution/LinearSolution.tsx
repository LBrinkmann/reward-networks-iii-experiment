import React, {FC} from "react"
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import NetworkNode from "../NetworkNode";

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
    nodeSize?: number;
    /** Gap between nodes. Default = 80 */
    gap?: number;
}


export const LinearSolution: FC<LinearSolutionInterface> = (props) => {
    const {size = {width: 700, height: 100}, nodeSize = 25, gap = 80, nodes, moves} = props;
    return (
        <svg width={size.width} height={size.height}>
            <g>
                {moves.map((move, idx) => {
                    const node = nodes[move];
                    return (
                        <NetworkNode
                            x={idx * gap}
                            y={size.height / 2}
                            nodeInx={node.node_num}
                            Text={node.display_name}
                            Size={nodeSize}
                            onNodeClick={() => null}
                            isActive={false}
                            isValidMove={false}
                            key={"node-" + idx}
                        />
                    );
                })};
            </g>

        </svg>
    )
}

export default LinearSolution