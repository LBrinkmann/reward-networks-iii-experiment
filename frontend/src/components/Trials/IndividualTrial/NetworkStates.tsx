import {useEffect, useState} from "react";

const useNetworkStates = (onNextTrialHandler: (moves: number[]) => void, maxSteps?: number) => {
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

            // wait for 1 second before the next trial
            setTimeout(() => {
                // go to the next trial
                onNextTrialHandler(moves);
            }, 1000);

        }
    }, [step, isTimerDone]);

    return {step, points, isTimerDone, moves, setStep, setPoints, setIsTimerDone, setMoves};
}

export default useNetworkStates;