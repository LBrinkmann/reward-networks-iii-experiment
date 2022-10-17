import React, {useEffect, useState} from "react";
import DynamicNetwork from "../../Network/DynamicNetwork";
import {DynamicNetworkInterface} from "../../Network/DynamicNetwork/DynamicNetwork";
import Timer from "./Timer";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import TrialWithNetworkLayout from "../TrialWithNetworkLayout";


export interface IndividualTrialInterface extends DynamicNetworkInterface {
    /** Handle the end of the trial */
    onNextTrialHandler: (moves?: number[]) => void;
    onTrialEndHandler?: (moves?: number[]) => void;
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

    const [step, setStep] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [isTimerDone, setIsTimerDone] = useState<boolean>(false);
    const [moves, setMoves] = useState<number[]>([]);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const s = JSON.parse(window.localStorage.getItem('step'))
        if (s) setStep(s);
        const p = JSON.parse(window.localStorage.getItem('points'))
        if (p) setPoints(p);
        const m = JSON.parse(window.localStorage.getItem('moves'))
        if (m) setMoves(m);
        const t = JSON.parse(window.localStorage.getItem('isTimerDone'))
        if (t) setIsTimerDone(t);
    }, []);

    // Go to the next trial when the timer is done or the subject has done all the steps
    useEffect(() => {
        // save states to local storage to prevent losing state on refresh
        window.localStorage.setItem('step', JSON.stringify(step));
        window.localStorage.setItem('points', JSON.stringify(points));
        window.localStorage.setItem('moves', JSON.stringify(moves));
        window.localStorage.setItem('isTimerDone', JSON.stringify(isTimerDone));

        if (isTimerDone || step === maxSteps) {
            if (props.onTrialEndHandler) props.onTrialEndHandler(moves);

            // reset local storage
            window.localStorage.removeItem('step');
            window.localStorage.removeItem('points');
            window.localStorage.removeItem('moves');
            window.localStorage.removeItem('isTimerDone');
            window.localStorage.removeItem('isBlankScreen');
            // from dynamic network
            window.localStorage.removeItem('currentNodeInx');
            window.localStorage.removeItem('movesDynamicNetwork');
            // from timer
            window.localStorage.removeItem('timePassed');

            // go to the next trial
            props.onNextTrialHandler(moves);

        }
    }, [step, isTimerDone]);

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