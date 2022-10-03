import React, {FC, useEffect, useState} from "react"
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import NetworkNode from "../NetworkNode";
import NetworkEdge from "../NetworkEdge";
import {Grid, Typography} from "@mui/material";

interface LinearSolutionInterface {
    /** Array of nodes of the network */
    nodes: StaticNetworkNodeInterface[];
    /** Array of edges of the network */
    edges: StaticNetworkEdgeInterface[];
    /** The list of moves with the starting node as the first element */
    moves: number[];
    /** Title of the solution */
    title?: string;
    /** Size of the SVG component. Default width = 800, height = 50 */
    size?: { width: number, height: number };
    /** Node size. Default = 20 */
    nodeRadius?: number;
    /** Edge width. Default = 3 */
    edgeWidth?: number;
    /** Gap between nodes. Default = 70 */
    gap?: number;
    /** Onset of the first node. Default = 24 */
    onset?: number;
}


export const LinearSolution: FC<LinearSolutionInterface> = (props) => {
    const {
        size = {width: 600, height: 50},
        nodeRadius = 20,
        gap = 60,
        onset = 24,
        edgeWidth = 3,
        nodes,
        edges,
        moves
    } = props;

    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        let score = 0;
        for (let i = 0; i < moves.length - 1; i++) {
            const edge = edges.find(e => e.source_num === moves[i] && e.target_num === moves[i + 1]);
            if (edge) {
                score += edge.reward;
            }
        }
        setScore(score);
    }, [moves]);

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
                    edgeWidth={edgeWidth}
                    edgeStyle={edge.edgeStyle}
                    idx={moveIdx + 100} // add 100 to avoid conflict with edge idx in other components
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
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom align={'left'}>
                    {props.title ? props.title : ""}: {score}
                </Typography>

            </Grid>
            <Grid item xs={12}>
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
                                        onNodeClick={null}
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
            </Grid>
        </Grid>
    )
}

export default LinearSolution