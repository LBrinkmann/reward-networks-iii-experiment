import React, {useEffect, useState} from "react";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import {Button, Grid} from "@mui/material";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";

export interface AnimatedNetworkInterface {
    nodes: StaticNetworkNodeInterface[];
    edges: StaticNetworkEdgeInterface[];
    moves: number[];
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
        if (currentMoveInx === null) {
            return;
        }
        setTimeout(() => {
            setCurrentNodeId(props.moves[currentMoveInx]);
            if (currentMoveInx !== 0) {
                setEdges(updateEdges(props.moves[currentMoveInx - 1], props.moves[currentMoveInx]));
            }
            setCurrentMoveInx(currentMoveInx + 1);
        }, delayBetweenMoves);
    }, [currentMoveInx]);

    const updateEdges = (sourceInx: number, targetInx: number) => {
        return edges.map((edge: StaticNetworkEdgeInterface) => {
            if (edge.source_num === sourceInx && edge.target_num === targetInx) {
                return {...edge, edgeStyle: "highlighted" as NetworkEdgeStyle};
            } else {
                return {...edge, edgeStyle: "normal" as NetworkEdgeStyle};
            }
        });
    }

    const startReplayHandler = () => {
        if (currentMoveInx === null) {
            setCurrentMoveInx(0);
            console.log("start replay");
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
                    onNodeClickHandler={() => {
                    }}
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