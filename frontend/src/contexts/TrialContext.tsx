import React, {createContext, useEffect, useState} from "react";
import {Advisor, PostSurvey, Solution, Trial, WrittenStrategy} from "../apis/apiTypes";

const LOCAL_STORAGE_TRIAL_KEY = 'trialData';
const LOCAL_STORAGE_RESULT_KEY = 'resultData';

export type TrialContextType = {
    trial: Trial | null;
    result: Solution | Advisor | WrittenStrategy | PostSurvey;
    updateTrial: (newTrial: Trial) => void;
    updateResult: (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => void;
};


export const TrialContext = createContext<TrialContextType | null>(null);


const TrialContextProvider = ({children}: any) => {
    const [trial, setTrial] = useState<Trial | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRIAL_KEY)));
    const [result, setResult] = useState<Solution | Advisor | WrittenStrategy | PostSurvey | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESULT_KEY)));

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TRIAL_KEY, JSON.stringify(trial));
    }, [trial]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_RESULT_KEY, JSON.stringify(result));
    }, [result]);

    const updateTrial = (newTrial: Trial) => setTrial(newTrial)

    const updateResult = (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => setResult(newResult)

    return (
        <TrialContext.Provider value={{trial, result, updateTrial, updateResult}}>
            {children}
        </TrialContext.Provider>
    );
};

export default TrialContextProvider;