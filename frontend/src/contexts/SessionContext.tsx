import React, {createContext, useContext, useEffect, useState} from "react";

const LOCAL_STORAGE_SESSION_STATE_KEY = 'sessionState';


export type SessionState = {
    participantId: string;
    totalPoints: number;
    currentTrial: number;
    socialLearningType: string;
    teacherInx: number;
    learningExampleInx: number;
}


export type SessionContextType = {
    sessionState: SessionState | null;
    updateSessionState: (newSessionState: SessionState) => void;
};


export const SessionContext = createContext<SessionContextType | null>(null);

const SessionContextProvider = ({children}: any) => {
    const [sessionState, setSessionState] = useState<SessionState | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_SESSION_STATE_KEY))
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SESSION_STATE_KEY, JSON.stringify(sessionState));
    }, [sessionState]);

    const updateSessionState = (newSessionState: SessionState) => setSessionState(newSessionState)

    return (
        <SessionContext.Provider value={{sessionState, updateSessionState}}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionContextProvider;

export const useSessionContext = () => useContext(SessionContext);