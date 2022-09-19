import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import {Button, Grid} from "@mui/material";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";

export interface AnimatedNetworkInterface {
    /** Array of nodes of the network */
    nodes: StaticNetworkNodeInterface[];
    /** Array of edges of the network */
    edges: StaticNetworkEdgeInterface[];
    /** The list of moves with the starting node as the first element */
    moves: number[];
    /** Delay in ms between each played move */
    delayBetweenMoves: number;
}

const AnimatedNetwork: React.FC<AnimatedNetworkInterface> = (
    {
        delayBetweenMoves = 1000,
        ...props
    }: AnimatedNetworkInterface) => {
    const [currentNodeId, setCurrentNodeId] = useState<number>(props.moves[0]);
    const [currentMoveInx, setCurrentMoveInx] = useState<number>(null);
    const [edges, setEdges] = useState<StaticNetworkEdgeInterface[]>(props.edges);

    useEffect(() => {
        // Do nothing before the replay button is clicked
        if (currentMoveInx !== null) {
            setTimeout(() => {
                    setCurrentNodeId(props.moves[currentMoveInx]);
                    // Skip edge highlight for the first move
                    if (currentMoveInx !== 0) {
                        setEdges(updateEdges(props.moves[currentMoveInx - 1], props.moves[currentMoveInx]));
                    }
                    setCurrentMoveInx(currentMoveInx + 1);
                },
                // Skip delay for the first move
                currentMoveInx < 2 ? 100 : delayBetweenMoves
            );
        }
    }, [currentMoveInx]);

    // Highlight the edge between the current node and the next node
    const updateEdges = (sourceInx: number, targetInx: number) => {
        return edges.map((edge: StaticNetworkEdgeInterface) => {
            if (edge.source_num === sourceInx && edge.target_num === targetInx) {
                return {...edge, edgeStyle: "highlighted" as NetworkEdgeStyle};
            } else {
                return {...edge, edgeStyle: "normal" as NetworkEdgeStyle};
            }
        });
    }

    // Trigger the replay animation
    const startReplayHandler = () => {
        if (currentMoveInx === null) {
            setCurrentMoveInx(0);
        }
    }

    return (
        <Grid sx={{flexGrow: 1}} direction="column" container spacing={4} justifyContent="center" alignItems="center">
            <Grid item>
                <StaticNetwork
                    edges={edges}
                    nodes={props.nodes}
                    currentNodeId={currentNodeId}
                    possibleMoves={[]}
                    size={{width: 550, height: 550}}
                    onNodeClickHandler={null}
                />
            </Grid>
            <Grid item>
                {currentMoveInx !== null ? (
                    <Button variant="contained" color="primary" disabled>Start Replay</Button>
                ) : (
                    <Button onClick={startReplayHandler} variant="contained" color="primary">Start Replay</Button>
                )}
            </Grid>

        </Grid>
    )
}


export default AnimatedNetwork;