import React, {useEffect, useState} from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import Timer from "../../Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";
import useNetworkStates from "../IndividualTrial/NetworkStates";
import LinearSolution from "../../Network/LinearSolution";

import {edges, nodes} from "./PracticeData";
import Header from "../../Header";


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
    const {timer = 25, maxSteps = 9} = props;
    const {
        step,
        points,
        isTimerDone,
        moves,
        setIsTimerDone,
        setStep,
        onNextStepHandler
    } = useNetworkStates(props.onNextTrialHandler, edges, nodes, maxSteps)
    const [tutorialId, setTutorialId] = useState<number>(1);

    // useEffect(() => {
    //     const t = JSON.parse(window.localStorage.getItem('tutorialId'));
    //     if (t) setTutorialId(t);
    // }, []);

    const onLastTooltipClick = () => {
        setStep(step + 1)
        // reset local storage
        // window.localStorage.setItem('tutorialId', JSON.stringify(1));
    }

    const onTooltipClick = () => {
        setTutorialId(tutorialId + 1);
        // window.localStorage.setItem('tutorialId', JSON.stringify(tutorialId + 1));
    }

    const onNextNodeClick = (currentNode: number, nextNode: number) => {
        switch (nextNode) {
            case 5: // node F (the second node in the path)
                setTutorialId(3)
                // window.localStorage.setItem('tutorialId', JSON.stringify(3));
                break;
            case 8: // node I (the third node in the path)
                setTutorialId(4)
                // window.localStorage.setItem('tutorialId', JSON.stringify(4));
                break;
            case 9: // node J (the last node in the path)
                setTutorialId(5)
                // window.localStorage.setItem('tutorialId', JSON.stringify(5));
                break;
        }

        onNextStepHandler(currentNode, nextNode)
    }

    const renderNetwork = () => {
        return (
            <DynamicNetwork
                nodes={nodes}
                edges={edges}
                onNodeClickParentHandler={onNextNodeClick}
                isDisabled={isTimerDone || step >= maxSteps || tutorialId < 2}
                // very first tooltip
                showNodeTutorial={tutorialId === 1}
                // the second tooltip without the OK button
                showEdgeTutorial={tutorialId === 2 && moves.length === 1}
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
            showTutorialScore={(moves.length >= 2) && (moves.length < 3)}  // tutorialId === 3
            onTutorialClose={null}  // No need for the OK button in the tooltip
        />
    )

    const renderLinearSolution = () => {
        return (
            <LinearSolution
                nodes={nodes}
                edges={edges}
                moves={moves}
                title={""}
                showTutorial={(moves.length >= 3) && (moves.length < 9)}  // tutorialId === 4 && moves.length > 2
                onTutorialClose={null}  // No need for the OK button in the tooltip
            />
        )
    }

    const renderTimer = () => {
        return (
            <Timer
                time={timer}
                OnTimeEndHandler={() => setIsTimerDone(true)}
                pause={true}
                showTutorial={tutorialId === 5 && moves.length === maxSteps}
                onTutorialClose={onTooltipClick}
            />
        )
    }


    return (
        <>
            <Header
                title={"Practice"}
                showTutorial={tutorialId === 6 && moves.length === maxSteps}
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