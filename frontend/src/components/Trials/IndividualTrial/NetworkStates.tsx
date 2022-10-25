import {useEffect, useState} from "react";
import {StaticNetworkEdgeInterface, StaticNetworkNodeInterface} from "../../Network/StaticNetwork/StaticNetwork";

const useNetworkStates = (
    onNextTrialHandler: (moves: number[]) => void,
    edges: StaticNetworkEdgeInterface[],
    nodes: StaticNetworkNodeInterface[],
    maxSteps?: number,
    // update total score
    updateTotalScore?: (points: number) => void
    ) => {

    const [step, setStep] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [isTimerDone, setIsTimerDone] = useState<boolean>(false);
    const [moves, setMoves] = useState<number[]>([nodes.filter(node => node.starting_node)[0].node_num]);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const s = JSON.parse(window.localStorage.getItem('step'))
        if (s) setStep(s);
        const p = JSON.parse(window.localStorage.getItem('points'))
        if (p) setPoints(p);
        const m = JSON.parse(window.localStorage.getItem('moves'))
        if (m) {
            setMoves(m)
        } else {
            setMoves([nodes.filter(node => node.starting_node)[0].node_num])
            window.localStorage.setItem('moves', JSON.stringify(moves));
        }

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

        if (isTimerDone || step >= maxSteps) {
            // wait for 1 second before the next trial
            setTimeout(() => {
                // reset local storage
                window.localStorage.removeItem('step');
                window.localStorage.removeItem('points');
                window.localStorage.removeItem('moves');
                window.localStorage.removeItem('isTimerDone');
                window.localStorage.removeItem('isBlankScreen');
                // from network components
                window.localStorage.removeItem('currentNodeInx');
                window.localStorage.removeItem('currentMoveInx');
                window.localStorage.removeItem('movesDynamicNetwork');
                // from timer
                window.localStorage.removeItem('timePassed');

                // go to the next trial
                onNextTrialHandler(moves);
            }, 500);

        }
    }, [step, isTimerDone]);

    const onNextStepHandler = (currentNode: number, nextNode: number) => {
        // Update moves
        setMoves([...moves, nextNode]);

        // Update state
        setStep(step + 1);
        // Select current edge
        const currentEdge = edges.filter(
            (edge) => edge.source_num === currentNode && edge.target_num === nextNode)[0];
        // Update cumulative reward
        setPoints(points + currentEdge.reward);
        // Update total score
        if (updateTotalScore) updateTotalScore(currentEdge.reward);
    }

    return {step, points, isTimerDone, moves, setStep, setPoints, setIsTimerDone, setMoves, onNextStepHandler};
}

export default useNetworkStates;