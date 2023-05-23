import React, {FC, useEffect} from "react";
import useNetworkContext from "../../../contexts/NetworkContext";
import {Box, Divider, Grid} from "@mui/material";
import StaticNetwork from "../../Network/StaticNetwork/StaticNetwork";
import PlayerInformation from "../PlayerInformation";
import LinearSolution from "../../Network/LinearSolution";
import Timer from "../../Timer";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";
import Legend from "./RewardsLegend";

interface NetworkTrialInterface {
    showLegend?: boolean;
    showComment?: boolean;
    teacherId?: number;
    showLinearNetwork?: boolean;
    showTimer?: boolean;
    time?: number;
    isPractice?: boolean;
    isTimerPaused?: boolean;
    playerTotalPoints?: number;
    showCurrentNetworkPoints?: boolean;
    showTotalPoints?: boolean;
}

const NetworkTrial: FC<NetworkTrialInterface> = (props) => {
    const {
        showLegend = true,
        showComment = false,
        teacherId = 1,
        showLinearNetwork = true,
        showTimer = true,
        time = 35,
        isPractice = false,
        isTimerPaused = false,
        playerTotalPoints = 0,
        showCurrentNetworkPoints = true,
        showTotalPoints = true,
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
                    <Grid item xs={4} mt={"340px"}>
                        {showTimer &&
                            <Timer
                                time={time}
                                invisibleTime={5} // 5 seconds before the timer starts
                                pause={isTimerPaused || networkState.isNetworkFinished || networkState.isNetworkDisabled}
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
                            totalScore={playerTotalPoints + networkState.points}
                            showComment={showComment}
                            comment={networkState.teacherComment}
                            showTutorialScore={networkState.tutorialOptions.points}
                            showTutorialComment={networkState.tutorialOptions.comment}
                            onTutorialCommentClose={onTutorialCommentClose}
                            showTutorialTotalScore={networkState.tutorialOptions.totalScore}
                            onTutorialClose={NextTutorialStepHandler}
                            showCumulativePoints={showCurrentNetworkPoints}
                            showTotalPoints={showTotalPoints}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={5}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item style={{position: 'relative'}}>
                        <FlashingReward/>
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
            <Grid item xs={1}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    {showLegend &&
                        <Grid item mt={"150px"}>
                            <Legend/>
                        </Grid>}
                </Grid>
            </Grid>
        </Grid>
    );
}
const FlashingReward: FC = () => {
    const allRewards = [-50, 0, 100, 200, 400];
    const colors = ['#c51b7d', '#e9a3c9', '#e6f5d0', '#a1d76a', '#4d9221',];
    const {networkState} = useNetworkContext();
    const [show, setShow] = React.useState(false);
    useEffect(() => {
        if (networkState.step !== 0) {
            setShow(true);
        }
    }, [networkState.step]);

    useEffect(() => {
        if (show) {
            // set timeout to reset status
            setTimeout(() => {
                setShow(false);
            }, 800);
        }
    }, [show]);

    return (
        <Box
            style={{position: 'absolute', top: '160px', left: '160px', opacity: show ? 0.8 : 0}}
            sx={{
                borderRadius: '50%',
                width: '60px',
                height: '40px',
                bgcolor: networkState.currentReward !== undefined ? colors[allRewards.indexOf(networkState.currentReward)] : 'white',
                typography: 'h4',
                textAlign: 'center',
                px: "40px",
                py: "50px"
            }}
        >
            {networkState.currentReward}
        </Box>
    )
}


export default NetworkTrial;