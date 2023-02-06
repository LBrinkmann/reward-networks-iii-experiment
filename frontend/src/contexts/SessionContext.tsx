import React, {createContext, useContext, useReducer} from "react";
import sessionReducer from "../reducers/SessionReducer";
import {AdvisorSelection} from "../apis/apiTypes";

const LOCAL_STORAGE_SESSION_STATE_KEY = 'sessionState';


export type SessionState = {
    totalPoints: number;
    currentTrialId: number;
    currentTrialType: string;
    advisors: AdvisorSelection | null;
    selectedAdvisor: { advisorId: string, advisorNumber: number } | null;
}


const sessionInitialState: SessionState = {
    totalPoints: 0,
    currentTrialId: 0,
    currentTrialType: '',
    advisors: null,
    selectedAdvisor: null,
}

export type SessionContextType = {
    sessionState: SessionState | null;
    sessionDispatcher: (actions: any) => void;
};


export const SessionContext = createContext<SessionContextType | null>(null);

const SessionContextProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(sessionReducer, sessionInitialState);

    // const [sessionState, setSessionState] = useState<SessionState | null>(
    //     JSON.parse(localStorage.getItem(LOCAL_STORAGE_SESSION_STATE_KEY))
    // );
    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_SESSION_STATE_KEY, JSON.stringify(sessionState));
    // }, [sessionState]);
    // const updateSessionState = (newSessionState: SessionState) => setSessionState(newSessionState)

    return (
        <SessionContext.Provider value={{sessionState: state, sessionDispatcher: dispatch}}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionContextProvider;

export const useSessionContext = () => useContext(SessionContext);