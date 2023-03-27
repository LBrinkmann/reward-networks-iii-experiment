import React, {createContext, useContext, useEffect, useReducer} from "react";
import sessionReducer from "../reducers/SessionReducer";
import {AdvisorSelection} from "../apis/apiTypes";

const LOCAL_STORAGE_SESSION_STATE_KEY = 'sessionState';


export type SessionState = {
    totalPoints: number;
    trialTitle: string;
    currentTrialId: number;
    currentTrialType: string;
    previousTrialType: string;
    advisors: AdvisorSelection | null;
    selectedAdvisor: { advisorId: string, advisorNumber: number } | null;
    selectedAdvisorExampleId: number;
    showTutorialInCurrentTrial: boolean;
}


const sessionInitialState: SessionState = {
    totalPoints: 0,
    trialTitle: '',
    currentTrialId: 0,
    currentTrialType: '',
    previousTrialType: '',
    advisors: null,
    selectedAdvisor: null,
    selectedAdvisorExampleId: 0,
    showTutorialInCurrentTrial: false,
}

export type SessionContextType = {
    sessionState: SessionState | null;
    sessionDispatcher: (actions: any) => void;
};


export const SessionContext = createContext<SessionContextType | null>(null);

const sessionInitializer = (initialState: SessionState) => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SESSION_STATE_KEY)) || initialState;
}

export const SessionContextProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(sessionReducer, sessionInitialState, sessionInitializer);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SESSION_STATE_KEY, JSON.stringify(state));
    }, [state]);

    return (
        <SessionContext.Provider value={{sessionState: state, sessionDispatcher: dispatch}}>
            {children}
        </SessionContext.Provider>
    );
};

const useSessionContext = () => useContext(SessionContext);

export default useSessionContext;