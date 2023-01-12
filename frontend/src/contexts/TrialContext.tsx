import React, {createContext, useContext, useEffect, useState} from "react";
import {Advisor, PostSurvey, Solution, Trial, WrittenStrategy} from "../apis/apiTypes";

const LOCAL_STORAGE_TRIAL_KEY = 'trialData';
const LOCAL_STORAGE_RESULT_KEY = 'resultData';
const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';
const LOCAL_STORAGE_SOCIAL_LEARNING_STATE_KEY = 'socialLearningState';

export type NetworkState = {
    step: number;
    points: number;
    moves: number[];
    time: number;
    currentNode: number;
}

export type SocialLearningState = {
    socialLearningType: string;
    teacherInx: number;
    learningExampleInx: number;
}

export type TrialContextType = {
    trial: Trial | null;
    result: Solution | Advisor | WrittenStrategy | PostSurvey;
    networkState: NetworkState | null;
    socialLearningState: SocialLearningState | null;
    updateTrial: (newTrial: Trial) => void;
    updateResult: (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => void;
    updateNetworkState: (newNetworkState: NetworkState) => void;
    updateSocialLearningState: (newSocialLearningState: SocialLearningState) => void;
};


export const TrialContext = createContext<TrialContextType | null>(null);


const TrialContextProvider = ({children}: any) => {
    const [trial, setTrial] = useState<Trial | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRIAL_KEY)));
    const [result, setResult] = useState<Solution | Advisor | WrittenStrategy | PostSurvey | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESULT_KEY)));
    const [networkState, setNetworkState] = useState<NetworkState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY)));
    const [socialLearningState, setSocialLearningState] = useState<SocialLearningState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_SOCIAL_LEARNING_STATE_KEY)));

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TRIAL_KEY, JSON.stringify(trial));
    }, [trial]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_RESULT_KEY, JSON.stringify(result));
    }, [result]);

    const updateTrial = (newTrial: Trial) => setTrial(newTrial)

    const updateResult = (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => setResult(newResult)

    const updateNetworkState = (newNetworkState: NetworkState) => setNetworkState(newNetworkState)

    const updateSocialLearningState = (newSocialLearningState: SocialLearningState) => setSocialLearningState(newSocialLearningState)

    return (
        <TrialContext.Provider value={{
            trial,
            result,
            networkState,
            socialLearningState,
            updateTrial,
            updateResult,
            updateNetworkState,
            updateSocialLearningState
        }}>
            {children}
        </TrialContext.Provider>
    );
};

export default TrialContextProvider;

export const useTrialContext = () => useContext(TrialContext);