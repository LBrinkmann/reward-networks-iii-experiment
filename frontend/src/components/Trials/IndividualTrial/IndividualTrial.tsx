import React from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import {DynamicNetworkInterface} from "../../Network/DynamicNetwork/DynamicNetwork";
import Timer from "./Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";
import useNetworkStates from "./NetworkStates";

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

}

const IndividualTrial: React.FC<IndividualTrialInterface> = (props) => {
    const {timer = 30, maxSteps = 8} = props;
    const {
        step,
        points,
        isTimerDone,
        moves,
        setStep,
        setPoints,
        setIsTimerDone,
        setMoves
    } = useNetworkStates(props.onNextTrialHandler, maxSteps)

    const onNodeClickHandler = (currentNode: number, nextNode: number) => {
        // Update moves
        if (moves.length === 0) {
            setMoves([currentNode, nextNode]);
        } else {
            setMoves([...moves, nextNode]);
        }
        // Update state
        setStep(step + 1);
        // Select current edge
        const currentEdge = props.edges.filter(
            (edge) => edge.source_num === currentNode && edge.target_num === nextNode)[0];
        // Update cumulative reward
        setPoints(points + currentEdge.reward);
    }

    const renderNetwork = () => (
        <DynamicNetwork
            nodes={props.nodes}
            edges={props.edges}
            onNodeClickParentHandler={onNodeClickHandler}
            isDisabled={isTimerDone}
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

    const renderTimer = () => <Timer time={timer} OnTimeEndHandler={() => setIsTimerDone(true)}/>

    return (
        <TrialWithNetworkLayout
            network={renderNetwork()}
            timer={renderTimer()}
            playerInformation={renderPlayerInformation()}
            linearSolution={() => {
            }}
            showTimer={true}
            showPlayerInformation={true}
            showLinearSolution={false}
        />
    );
};


export default IndividualTrial;