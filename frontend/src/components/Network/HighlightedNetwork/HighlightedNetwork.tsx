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
    onNextStepHandler?: (stepNumber: number, addPoints: number) => void;

}

export const HighlightedNetwork: FC<HighlightedNetworkInterface> = (props: HighlightedNetworkInterface) => {
    const {moves} = props;

    const [currentNodeInx, setCurrentNodeInx] = useState<number>(0);
    const [edges, setEdges] = useState<StaticNetworkEdgeInterface[]>(props.edges);
    const [points, setPoints] = useState<number>(0);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const n = JSON.parse(window.localStorage.getItem('currentNodeInx'))
        if (n) {
            setCurrentNodeInx(n);
            setEdges(updateEdges(moves[n], moves[n + 1]));
        } else {
            setEdges(updateEdges(moves[0], moves[1]));
        }
    }, []);

    useEffect(() => {
        // save states to local storage to prevent losing state on refresh
        window.localStorage.setItem('currentNodeInx', JSON.stringify(currentNodeInx));

        props.onNextStepHandler(currentNodeInx, points);
    }, [currentNodeInx]);

    // Highlight the edge between the current node and the next node
    const updateEdges = (sourceInx: number, targetInx: number) => {
        return edges.map((edge: StaticNetworkEdgeInterface) => {
            if (edge.source_num === sourceInx && edge.target_num === targetInx) {
                setPoints(edge.reward);
                return {...edge, edgeStyle: "animated" as NetworkEdgeStyle};
            } else {
                return {...edge, edgeStyle: "normal" as NetworkEdgeStyle};
            }
        });
    }

    const OnNodeClick = (nodeId: number) => {
        if((currentNodeInx < moves.length) && (nodeId === moves[currentNodeInx + 1])) {
            setEdges(updateEdges(moves[currentNodeInx+1], moves[currentNodeInx + 2]));
            setCurrentNodeInx(currentNodeInx + 1);
        }
    }

    return (
        <Grid sx={{flexGrow: 1}} direction="column" container spacing={4} justifyContent="center" alignItems="center">
            <Grid item>
                <StaticNetwork
                    edges={edges}
                    nodes={props.nodes}
                    currentNodeId={moves[currentNodeInx]}
                    possibleMoves={[moves[currentNodeInx + 1]] || []}
                    size={460}
                    onNodeClickHandler={OnNodeClick}
                />
            </Grid>
        </Grid>
    )
}

export default HighlightedNetwork;