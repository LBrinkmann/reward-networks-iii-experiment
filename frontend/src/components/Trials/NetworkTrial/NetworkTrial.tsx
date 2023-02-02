import React, {FC} from "react";
import useNetworkContext from "../../../contexts/NetworkContext";
import {Divider, Grid} from "@mui/material";
import StaticNetwork from "../../Network/StaticNetwork/StaticNetwork";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import LinearSolution from "../../Network/LinearSolution";
import Timer from "../../Timer";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";

interface NetworkTrialInterface {
    showLegend?: boolean;
    showComment?: boolean;
    showLinearNetwork?: boolean;
    showTimer?: boolean;
    time?: number;
    isPractice?: boolean;
    isTimerPaused?: boolean;

}

const NetworkTrial: FC<NetworkTrialInterface> = (props) => {
    const {showLinearNetwork = true, showTimer = true, time = 35, isPractice = false, isTimerPaused = false} = props;
    const {networkState, networkDispatcher} = useNetworkContext();

    const NodeClickHandler = (nodeIdx: number) => {
        // skip update if network is disabled or finished
        if (networkState.isNetworkDisabled || networkState.isNetworkFinished) return;

        networkDispatcher({type: NETWORK_ACTIONS.NEXT_NODE, payload: {nodeIdx}});

        if (isPractice) networkDispatcher({type: NETWORK_ACTIONS.NEXT_TUTORIAL_STEP});
    }

    const TimerDoneHandler = () => networkDispatcher({type: NETWORK_ACTIONS.TIMER_DONE,});

    const NextTutorialStepHandler = () => networkDispatcher({type: NETWORK_ACTIONS.NEXT_TUTORIAL_STEP,});


    return (
        <Grid container sx={{margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item sx={{p: 1}} xs={3}>
                <Grid container direction="column">
                    <Grid item xs={4}>
                        {showTimer &&
                            <Timer
                                time={time}
                                invisibleTime={5} // 5 seconds before the timer starts
                                OnTimeEndHandler={TimerDoneHandler}
                                pause={isPractice || isTimerPaused || networkState.isNetworkFinished || networkState.isNetworkDisabled}
                                showTutorial={networkState.tutorialOptions.time}
                                onTutorialClose={NextTutorialStepHandler}
                            />
                        }
                    </Grid>
                    <Grid item xs={8}>
                        <PlayerInformation
                            id={1}
                            step={networkState.step}
                            cumulativePoints={networkState.points}
                            showComment={false}
                            showTutorialScore={networkState.tutorialOptions.points}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item>
                        <StaticNetwork
                            edges={networkState.network.edges}
                            nodes={networkState.network.nodes}
                            currentNodeId={networkState.isNetworkFinished ? null : networkState.currentNode}
                            possibleMoves={networkState.possibleMoves}
                            onNodeClickHandler={NodeClickHandler}
                            disableClick={networkState.isNetworkDisabled}
                            showEdgeTutorial={networkState.tutorialOptions.edge}
                            showNodeTutorial={networkState.tutorialOptions.node}
                            onTutorialClose={NextTutorialStepHandler}
                        />
                        <Divider variant="middle" light/>
                    </Grid>
                    <Grid item sx={{marginTop: '10px'}}>
                        {showLinearNetwork &&
                            <LinearSolution
                                edges={networkState.network.edges}
                                nodes={networkState.network.nodes}
                                moves={networkState.moves}
                                showTutorial={networkState.tutorialOptions.linearSolution}
                            />
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default NetworkTrial;