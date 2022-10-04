import React, {FC, useEffect, useState} from "react"
import {Grid} from "@mui/material";
import StaticNetwork from "../StaticNetwork";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../StaticNetwork/StaticNetwork";
import {NetworkEdgeStyle} from "../NetworkEdge/NetworkEdge";

export interface HighlightedNetworkInterface {
    /** Array of nodes of the network */
    nodes: StaticNetworkNodeInterface[];
    /** Array of edges of the network */
    edges: StaticNetworkEdgeInterface[];
    /** The list of moves with the starting node as the first element */
    moves: number[];
    /** Hook to handle parent states on new step */
    onNextStepHandler?: (stepNumber: number, cumulativeScore: number) => void;

}

export const HighlightedNetwork: FC<HighlightedNetworkInterface> = (props: HighlightedNetworkInterface) => {
    const {moves} = props;

    const [currentNodeId, setCurrentNodeId] = useState<number>(props.moves[0]);
    const [currentMoveInx, setCurrentMoveInx] = useState<number>(0);
    const [edges, setEdges] = useState<StaticNetworkEdgeInterface[]>(props.edges);
    const [cumulativeScore, setCumulativeScore] = useState<number>(0);

    useEffect(() => {
        setEdges(updateEdges(moves[currentMoveInx], moves[currentMoveInx + 1]));
    }, [currentMoveInx]);

    // Highlight the edge between the current node and the next node
    const updateEdges = (sourceInx: number, targetInx: number) => {
        return edges.map((edge: StaticNetworkEdgeInterface) => {
            if (edge.source_num === sourceInx && edge.target_num === targetInx) {
                setCumulativeScore(cumulativeScore + edge.reward);
                return {...edge, edgeStyle: "animated" as NetworkEdgeStyle};
            } else {
                return {...edge, edgeStyle: "normal" as NetworkEdgeStyle};
            }
        });
    }

    const OnNodeClick = (nodeId: number) => {
        if((currentMoveInx < moves.length) && (nodeId === moves[currentMoveInx + 1])) {
            props.onNextStepHandler(currentMoveInx + 1, cumulativeScore);
            setCurrentNodeId(nodeId);
            setCurrentMoveInx(currentMoveInx + 1);
        }
    }

    return (
        <Grid sx={{flexGrow: 1}} direction="column" container spacing={4} justifyContent="center" alignItems="center">
            <Grid item>
                <StaticNetwork
                    edges={edges}
                    nodes={props.nodes}
                    currentNodeId={currentNodeId}
                    possibleMoves={[moves[currentMoveInx + 1]] || []}
                    size={460}
                    onNodeClickHandler={OnNodeClick}
                />
            </Grid>
        </Grid>
    )
}

export default HighlightedNetwork;