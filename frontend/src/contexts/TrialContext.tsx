import React, {createContext, useContext, useEffect, useState} from "react";
import {Advisor, PostSurvey, Solution, Trial, WrittenStrategy} from "../apis/apiTypes";

const LOCAL_STORAGE_TRIAL_KEY = 'trialData';
const LOCAL_STORAGE_RESULT_KEY = 'resultData';
const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';

export type NetworkState = {
    step: number;
    points: number;
    moves: number[];
    time: number;
    currentNode: number;
}

export type TrialContextType = {
    trial: Trial | null;
    result: Solution | Advisor | WrittenStrategy | PostSurvey;
    networkState: NetworkState | null;
    updateTrial: (newTrial: Trial) => void;
    updateResult: (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => void;
    updateNetworkState: (newNetworkState: NetworkState) => void;
};


export const TrialContext = createContext<TrialContextType | null>(null);


const TrialContextProvider = ({children}: any) => {
    const [trial, setTrial] = useState<Trial | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRIAL_KEY)));
    const [result, setResult] = useState<Solution | Advisor | WrittenStrategy | PostSurvey | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESULT_KEY)));
    const [networkState, setNetworkState] = useState<NetworkState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY)));

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TRIAL_KEY, JSON.stringify(trial));
    }, [trial]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_RESULT_KEY, JSON.stringify(result));
    }, [result]);

    const updateTrial = (newTrial: Trial) => setTrial(newTrial)

    const updateResult = (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => setResult(newResult)

    const updateNetworkState = (newNetworkState: NetworkState) => setNetworkState(newNetworkState)

    return (
        <TrialContext.Provider value={{trial, result, networkState, updateTrial, updateResult, updateNetworkState}}>
            {children}
        </TrialContext.Provider>
    );
};

export default TrialContextProvider;

export const useTrialContext = () => useContext(TrialContext);