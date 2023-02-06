import React, {FC} from "react";
import useNetworkContext from "../../../contexts/NetworkContext";
import {Divider, Grid} from "@mui/material";
import StaticNetwork from "../../Network/StaticNetwork/StaticNetwork";
import PlayerInformation from "../PlayerInformation";
import LinearSolution from "../../Network/LinearSolution";
import Timer from "../../Timer";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";

interface NetworkTrialInterface {
    showLegend?: boolean;
    showComment?: boolean;
    teacherId?: number;
    showLinearNetwork?: boolean;
    showTimer?: boolean;
    time?: number;
    isPractice?: boolean;
    isTimerPaused?: boolean;
}

const NetworkTrial: FC<NetworkTrialInterface> = (props) => {
    const {
        showComment = false,
        teacherId = 1,
        showLinearNetwork = true,
        showTimer = true,
        time = 35,
        isPractice = false,
        isTimerPaused = false,
    } = props;
    const {networkState, networkDispatcher} = useNetworkContext();

    const NodeClickHandler = (nodeIdx: number) => {
        // skip update if network is disabled or finished
        if (networkState.isNetworkDisabled || networkState.isNetworkFinished) return;

        networkDispatcher({type: NETWORK_ACTIONS.NEXT_NODE, payload: {nodeIdx}});

        if (isPractice) networkDispatcher({type: NETWORK_ACTIONS.NEXT_TUTORIAL_STEP});
    }

    const NextTutorialStepHandler = () => networkDispatcher({type: NETWORK_ACTIONS.NEXT_TUTORIAL_STEP,});

    const onTutorialCommentClose = () => networkDispatcher({type: NETWORK_ACTIONS.FINISH_COMMENT_TUTORIAL,});


    return (
        <Grid container sx={{margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item sx={{p: 1}} xs={3}>
                <Grid container direction="column">
                    <Grid item xs={4}>
                        {showTimer &&
                            <Timer
                                time={time}
                                invisibleTime={5} // 5 seconds before the timer starts
                                pause={isPractice || isTimerPaused || networkState.isNetworkFinished || networkState.isNetworkDisabled}
                                showTutorial={networkState.tutorialOptions.time}
                                onTutorialClose={NextTutorialStepHandler}
                            />
                        }
                    </Grid>
                    <Grid item xs={8}>
                        <PlayerInformation
                            id={teacherId}
                            step={networkState.step}
                            cumulativePoints={networkState.points}
                            showComment={showComment}
                            comment={networkState.teacherComment}
                            showTutorialScore={networkState.tutorialOptions.points}
                            showTutorialComment={networkState.tutorialOptions.comment}
                            onTutorialCommentClose={onTutorialCommentClose}
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
                            blur={networkState.tutorialOptions.comment}
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