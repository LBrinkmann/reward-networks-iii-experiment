import React, {createContext, useContext, useEffect, useState} from "react";
import {Advisor, PostSurvey, Solution, WrittenStrategy} from "../apis/apiTypes";

const LOCAL_STORAGE_RESULT_KEY = 'resultData';
const LOCAL_STORAGE_NETWORK_STATE_KEY = 'networkState';
const LOCAL_STORAGE_SOCIAL_LEARNING_STATE_KEY = 'socialLearningState';
const LOCAL_STORAGE_SESSION_STATE_KEY = 'sessionState';

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

export type SessionState = {
    totalPoints: number;
    prolificId: string;
    currentTrial: number;
}

export type TrialContextType = {
    result: Solution | Advisor | WrittenStrategy | PostSurvey;
    networkState: NetworkState | null;
    socialLearningState: SocialLearningState | null;
    sessionState: SessionState | null;
    updateSessionState: (newSessionState: SessionState) => void;
    updateResult: (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => void;
    updateNetworkState: (newNetworkState: NetworkState) => void;
    updateSocialLearningState: (newSocialLearningState: SocialLearningState) => void;
};


export const TrialContext = createContext<TrialContextType | null>(null);


const TrialContextProvider = ({children}: any) => {
    const [result, setResult] = useState<Solution | Advisor | WrittenStrategy | PostSurvey | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESULT_KEY))
    );
    const [networkState, setNetworkState] = useState<NetworkState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_NETWORK_STATE_KEY))
    );
    const [socialLearningState, setSocialLearningState] = useState<SocialLearningState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_SOCIAL_LEARNING_STATE_KEY))
    );
    const [sessionState, setSessionState] = useState<SessionState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_SESSION_STATE_KEY))
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_RESULT_KEY, JSON.stringify(result));
    }, [result]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_NETWORK_STATE_KEY, JSON.stringify(networkState));
    }, [networkState]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SOCIAL_LEARNING_STATE_KEY, JSON.stringify(socialLearningState));
    }, [socialLearningState]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SESSION_STATE_KEY, JSON.stringify(sessionState));
    }, [sessionState]);

    const updateResult = (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => setResult(newResult)

    const updateNetworkState = (newNetworkState: NetworkState) => setNetworkState(newNetworkState)

    const updateSocialLearningState = (newSocialLearningState: SocialLearningState) => setSocialLearningState(newSocialLearningState)

    const updateSessionState = (newSessionState: SessionState) => setSessionState(newSessionState)

    return (
        <TrialContext.Provider value={{
            result,
            networkState,
            socialLearningState,
            sessionState,
            updateResult,
            updateNetworkState,
            updateSocialLearningState,
            updateSessionState
        }}>
            {children}
        </TrialContext.Provider>
    );
};

export default TrialContextProvider;

export const useTrialContext = () => useContext(TrialContext);