import React, {createContext, useContext, useEffect, useReducer} from "react";
import sessionReducer from "../reducers/SessionReducer";
import {Advisor, AdvisorSelection, PostSurvey, Solution, WrittenStrategy} from "../apis/apiTypes";

const LOCAL_STORAGE_SESSION_STATE_KEY = 'sessionState';


export type SessionState = {
    totalPoints: number;
    trialTitle: string;
    currentTrialId: number;
    currentTrialType: string;
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

export const SessionContextProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(sessionReducer, sessionInitialState);

    // const [sessionState, setSessionState] = useState<SessionState | null>(
    //     JSON.parse(localStorage.getItem(LOCAL_STORAGE_SESSION_STATE_KEY))
    // );
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SESSION_STATE_KEY, JSON.stringify(state));
    }, [state]);
    // const updateSessionState = (newSessionState: SessionState) => setSessionState(newSessionState)

    return (
        <SessionContext.Provider value={{sessionState: state, sessionDispatcher: dispatch}}>
            {children}
        </SessionContext.Provider>
    );
};

const useSessionContext = () => useContext(SessionContext);

export default useSessionContext;