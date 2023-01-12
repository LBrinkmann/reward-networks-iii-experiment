import React, { FC } from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import Timer from "../../Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";
import LinearSolution from "../../Network/LinearSolution";

import {edges, nodes} from "./PracticeData";
import Header from "../../Header";
import {ExperimentTrialsProps} from "../ExperimentTrial";
import {useTrialContext} from "../../../contexts/TrialContext";


export interface PracticeNetworkTrialInterface extends ExperimentTrialsProps {
    /** Handle the end of the trial */
    onNextTrialHandler?: (moves?: number[]) => void;
    /** Timer duration in seconds; 30 seconds by default */
    timer?: number;
    /** The maximum number of steps in the trial. Default is 8 steps*/
    maxSteps?: number;
    /** number of seconds to wait before the next trial starts. Default 2 seconds*/
    waitBeforeNextTrial?: number;
    /** Hide the trial. Default false */
    hideTrial?: boolean;

}

const PracticeNetworkTrial: FC<PracticeNetworkTrialInterface> = (props) => {
    const {timer = 25, maxSteps = 9} = props;
    const { networkState, updateNetworkState } = useTrialContext();

    const onNextNodeClick = (currentNode: number, nextNode: number) => {
        switch (nextNode) {
            case 5: // node F (the second node in the path)
                updateNetworkState({...networkState, tutorialId: 3});
                break;
            case 8: // node I (the third node in the path)
                updateNetworkState({...networkState, tutorialId: 4});
                break;
            case 9: // node J (the last node in the path)
                updateNetworkState({...networkState, tutorialId: 5});
                break;
        }
    }

    const onTutorialClose = () => {
        updateNetworkState({...networkState, step: networkState.step + 1});
    }

    const onLastTooltipClick = () => {
        props.onTrialFinished({moves: networkState.moves, score: networkState.points});
    }

    const renderNetwork = () => {
        return (
            <DynamicNetwork
                nodes={nodes}
                edges={edges}
                onNodeClickParentHandler={onNextNodeClick}
                isDisabled={networkState.time > timer || networkState.step >= maxSteps || networkState.tutorialId < 2}
                // very first tooltip
                showNodeTutorial={networkState.tutorialId === 1}
                // the second tooltip without the OK button
                showEdgeTutorial={networkState.tutorialId === 2 && networkState.moves.length === 1}
                onTutorialClose={onTutorialClose}
            />
        )
    }

    const renderPlayerInformation = () => (
        <PlayerInformation
            id={1}
            step={networkState.step}
            cumulativePoints={networkState.points}
            showComment={false}
            showTutorialScore={(networkState.moves.length >= 2) && (networkState.moves.length < 3)}  // tutorialId === 3
            onTutorialClose={null}  // No need for the OK button in the tooltip
        />
    )

    const renderLinearSolution = () => {
        return (
            <LinearSolution
                nodes={nodes}
                edges={edges}
                moves={networkState.moves}
                title={""}
                showTutorial={(networkState.moves.length >= 3) && (networkState.moves.length < 9)}  // tutorialId === 4 && moves.length > 2
                onTutorialClose={null}  // No need for the OK button in the tooltip
            />
        )
    }

    const renderTimer = () => {
        return (
            <Timer
                time={timer}
                // OnTimeEndHandler={() => setIsTimerDone(true)}
                pause={true}
                showTutorial={networkState.tutorialId === 5 && networkState.moves.length === maxSteps}
                onTutorialClose={onTutorialClose}
            />
        )
    }


    return (
        <>
            <Header
                title={"Practice"}
                showTutorial={networkState.tutorialId === 6 && networkState.moves.length === maxSteps}
                showTip={false}
                onTutorialClose={onLastTooltipClick}
                totalPoints={0}
            />
            <TrialWithNetworkLayout
                network={renderNetwork()}
                timer={renderTimer()}
                playerInformation={renderPlayerInformation()}
                linearSolution={renderLinearSolution()}
                showTimer={true}
                showPlayerInformation={true}
                showLinearSolution={true}
            />
        </>
    );
};


export default PracticeNetworkTrial;