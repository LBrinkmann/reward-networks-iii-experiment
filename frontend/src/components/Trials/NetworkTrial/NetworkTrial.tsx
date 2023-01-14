import React, {FC} from "react";
import {NETWORK_ACTIONS, useNetworkContext} from "../../../contexts/NetworkContext";
import {Divider, Grid} from "@mui/material";
import StaticNetwork, {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../../Network/StaticNetwork/StaticNetwork";

interface NetworkTrialInterface {
    nodes: StaticNetworkNodeInterface[];
    edges: StaticNetworkEdgeInterface[];
}

const NetworkTrial: FC = () => {
    const {networkState, networkDispatcher} = useNetworkContext();

    const NodeClickHandler = (nodeIdx: number) => {
        networkDispatcher({
            type: NETWORK_ACTIONS.NEXT_NODE,
            payload: {nodeIdx}
        });
    }

    return (
        <Grid container sx={{margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item sx={{p: 1}} xs={3}>
                <Grid container direction="column">
                    <Grid item xs={4}>
                        {/*{showTimer &&*/}
                        {/*    <Timer*/}
                        {/*        time={25}*/}
                        {/*        invisibleTime={5} // 5 seconds before the timer starts*/}
                        {/*        // OnTimeEndHandler={() => setIsTimerDone(true)}*/}
                        {/*    />*/}
                        {/*}*/}
                    </Grid>
                    <Grid item xs={8}>
                        {/*<PlayerInformation*/}
                        {/*    id={1}*/}
                        {/*    step={step}*/}
                        {/*    cumulativePoints={points}*/}
                        {/*    showComment={false}*/}
                        {/*/>*/}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item>
                        <StaticNetwork
                            edges={networkState.network.edges}
                            nodes={networkState.network.nodes}
                            currentNodeId={networkState.currentNode}
                            possibleMoves={networkState.possibleMoves}
                            onNodeClickHandler={networkState.isNetworkDisabled ? null : NodeClickHandler}
                        />
                        <Divider variant="middle" light/>
                    </Grid>
                    <Grid item sx={{marginTop: '10px'}}>
                        {/*{showLinearSolution &&*/}
                        {/*    <LinearSolution/>*/}
                        {/*}*/}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default NetworkTrial;