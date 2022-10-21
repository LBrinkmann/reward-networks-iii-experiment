import React, {useState} from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import Timer from "../../Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";
import useNetworkStates from "../IndividualTrial/NetworkStates";
import LinearSolution from "../../Network/LinearSolution";

import {edges, nodes} from "./PracticeData";


export interface PracticeNetworkTrialInterface {
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

}

const PracticeNetworkTrial: React.FC<PracticeNetworkTrialInterface> = (props) => {
    const {timer = 25, maxSteps = 8} = props;
    const {
        step,
        points,
        isTimerDone,
        moves,
        setIsTimerDone,
        onNextStepHandler
    } = useNetworkStates(props.onNextTrialHandler, edges, nodes, maxSteps)
    const [tutorialId, setTutorialId] = useState<number>(1);

    const onTooltipClick = () => {
        setTutorialId(tutorialId + 1)
    }

    const renderNetwork = () => {
        // <TutorialTip tutorialId={"practice_node"} isTutorial={true} isShowTip={true}>
        return (
            <DynamicNetwork
                nodes={nodes}
                edges={edges}
                onNodeClickParentHandler={onNextStepHandler}
                isDisabled={isTimerDone || step >= maxSteps}
                showNodeTutorial={tutorialId === 1}
                showEdgeTutorial={tutorialId === 2}
                onTutorialClose={onTooltipClick}
            />
        )
    }

    const renderPlayerInformation = () => (
        <PlayerInformation
            id={1}
            step={step}
            cumulativePoints={points}
            showComment={false}
            showTutorial={tutorialId === 3 && moves.length > 1}
            onTutorialClose={onTooltipClick}
        />
    )


    const renderLinearSolution = () => {
        return (
            <LinearSolution
                nodes={nodes}
                edges={edges}
                moves={moves}
                title={""}
                showTutorial={tutorialId === 4 && moves.length > 2}
                onTutorialClose={onTooltipClick}
            />
        )
    }

    const renderTimer = () => {
        return (
            <Timer
                time={timer}
                OnTimeEndHandler={() => setIsTimerDone(true)}
                pause={true}
                showTutorial={tutorialId === 5 && moves.length === maxSteps + 1}
                onTutorialClose={onTooltipClick}
            />
        )
    }


    return (
        <TrialWithNetworkLayout
            network={renderNetwork()}
            timer={renderTimer()}
            playerInformation={renderPlayerInformation()}
            linearSolution={renderLinearSolution()}
            showTimer={true}
            showPlayerInformation={true}
            showLinearSolution={true}
        />
    );
};


export default PracticeNetworkTrial;