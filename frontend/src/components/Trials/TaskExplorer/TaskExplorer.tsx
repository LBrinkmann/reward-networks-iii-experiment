import React from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import Timer from "../../Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";
import useNetworkStates from "../IndividualTrial/NetworkStates";
import LinearSolution from "../../Network/LinearSolution";
import {IndividualTrialInterface} from "../IndividualTrial/IndividualTrial";
import {Button} from "@mui/material";

export interface TaskExplorerInterface extends IndividualTrialInterface {
    reload: () => void;
}

const TaskExplorer: React.FC<TaskExplorerInterface> = (props) => {
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

    const reloadData = () => {
        // hacky way to reset the trial data
        setIsTimerDone(true);
        window.localStorage.clear();
        props.reload();
    }

    const renderNetwork = () => (
        <DynamicNetwork
            nodes={props.nodes}
            edges={props.edges}
            onNodeClickParentHandler={onNextStepHandler}
            isDisabled={isTimerDone || step >= maxSteps}
        />
    )

    const renderPlayerInformation = () => (
        <>
            <PlayerInformation
                id={1}
                step={step}
                cumulativePoints={points}
                showComment={false}
                showLegend={false}
            />

            <Button variant="contained" onClick={reloadData} sx={{marginTop: "20px"}}>Reload</Button>
        </>
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


    return (
        <TrialWithNetworkLayout
            network={renderNetwork()}
            timer={() => {}}
            playerInformation={renderPlayerInformation()}
            linearSolution={renderLinearSolution()}
            showTimer={false}
            showPlayerInformation={true}
            showLinearSolution={true}
        />
    );
};


export default TaskExplorer;