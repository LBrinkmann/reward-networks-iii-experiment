import React from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import {DynamicNetworkInterface} from "../../Network/DynamicNetwork/DynamicNetwork";
import Timer from "../../Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";
import useNetworkStates from "../IndividualTrial/NetworkStates";
import LinearSolution from "../../Network/LinearSolution";
import {Box, Button} from "@mui/material";

export interface IndividualTrialInterface extends DynamicNetworkInterface {
    /** Handle the end of the trial */
    onNextTrialHandler: (moves?: number[]) => void;
    /** Timer duration in seconds; 30 seconds by default */
    timer?: number;
    /** The maximum number of steps in the trial. Default is 8 steps*/
    maxSteps?: number;
    /** number of seconds to wait before the next trial starts. Default 2 seconds*/
    waitBeforeNextTrial?: number;
    /** Hide the trial. Default false */
    hideTrial?: boolean;
    /** Callback to update player's total score */
    updateTotalScore?: (score: number) => void;
    /** Punishment for the incomplete trials */
    incompleteTrialPunishment?: number;
}

const TaskExplorer: React.FC<IndividualTrialInterface> = (props) => {
    const {timer = 25, maxSteps = 8, incompleteTrialPunishment = -100} = props;
    const {
        step,
        points,
        isTimerDone,
        moves,
        setIsTimerDone,
        onNextStepHandler
    } = useNetworkStates(
        props.onNextTrialHandler, props.edges, props.nodes, maxSteps, props.updateTotalScore, incompleteTrialPunishment)

    const renderNetwork = () => (
        <DynamicNetwork
            nodes={props.nodes}
            edges={props.edges}
            onNodeClickParentHandler={onNextStepHandler}
            isDisabled={isTimerDone || step >= maxSteps}
        />
    )

    const renderPlayerInformation = () => (
        <PlayerInformation
            id={1}
            step={step}
            cumulativePoints={points}
            showComment={false}
        />
    )

    const renderLinearSolution = () => (
        <LinearSolution
            nodes={props.nodes}
            edges={props.edges}
            moves={moves}
            title={""}
        />
    )

    const renderTimer = () => <Timer
        time={timer}
        invisibleTime={5} // 5 seconds before the timer starts
        OnTimeEndHandler={() => setIsTimerDone(true)}
    />

    const resetData = () => {
        // hacky way to reset the trial data
        setIsTimerDone(true);
        window.localStorage.clear();
    }

    return (
        <>
            <TrialWithNetworkLayout
                network={renderNetwork()}
                timer={renderTimer()}
                playerInformation={renderPlayerInformation()}
                linearSolution={renderLinearSolution()}
                showTimer={true}
                showPlayerInformation={true}
                showLinearSolution={true}
            />
            {/* put the button in the middle of the screen */}
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>

                <Button variant="contained" color="error" onClick={resetData}> Reset </Button>
            </Box>
        </>
    );
};


export default TaskExplorer;