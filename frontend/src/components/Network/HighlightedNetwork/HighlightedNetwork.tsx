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
    onNextStepHandler?: (currentNode: number, nextNode: number) => void;

}

export const HighlightedNetwork: FC<HighlightedNetworkInterface> = (props: HighlightedNetworkInterface) => {
    const {moves} = props;

    const [currentMoveInx, setCurrentMoveInx] = useState<number>(0);
    const [edges, setEdges] = useState<StaticNetworkEdgeInterface[]>(props.edges);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const n = JSON.parse(window.localStorage.getItem('currentMoveInx'))
        if (n) {
            setCurrentMoveInx(n);
            setEdges(updateEdges(moves[n], moves[n + 1]));
        } else {
            setEdges(updateEdges(moves[0], moves[1]));
        }
    }, []);

    // Highlight the edge between the current node and the next node
    const updateEdges = (sourceInx: number, targetInx: number) => {
        return edges.map((edge: StaticNetworkEdgeInterface) => {
            if (edge.source_num === sourceInx && edge.target_num === targetInx) {
                return {...edge, edgeStyle: "animated" as NetworkEdgeStyle};
            } else {
                return {...edge, edgeStyle: "normal" as NetworkEdgeStyle};
            }
        });
    }

    const OnNodeClick = (nodeId: number) => {
        if ((currentMoveInx < moves.length) && (nodeId === moves[currentMoveInx + 1])) {
            // save states to local storage to prevent losing state on refresh
            window.localStorage.setItem('currentMoveInx', JSON.stringify(currentMoveInx + 1));
            props.onNextStepHandler(moves[currentMoveInx], moves[currentMoveInx + 1]);
            setEdges(updateEdges(moves[currentMoveInx + 1], moves[currentMoveInx + 2]));
            setCurrentMoveInx(currentMoveInx + 1);
        }
    }

    return (
        <Grid sx={{flexGrow: 1}} direction="column" container spacing={4} justifyContent="center" alignItems="center">
            <Grid item>
                <StaticNetwork
                    edges={edges}
                    nodes={props.nodes}
                    currentNodeId={moves[currentMoveInx]}
                    possibleMoves={[moves[currentMoveInx + 1]] || []}
                    size={460}
                    onNodeClickHandler={OnNodeClick}
                />
            </Grid>
        </Grid>
    )
}

export default HighlightedNetwork;