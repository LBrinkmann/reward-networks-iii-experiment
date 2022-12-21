import React, {createContext, useEffect, useState} from "react";
import {Trial} from "../apis/apiTypes";

const LOCAL_STORAGE_KEY = 'trialData';

export type TrialContextType = {
    trial: Trial | null;
    updateTrial: (newTrial: Trial) => void;
};


export const TrialContext = createContext<TrialContextType | null>(null);


const TrialContextProvider = ({children}: any) => {
    const [trial, setTrial] = useState<Trial | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trial));
    }, [trial]);

    const updateTrial = (newTrial: Trial) => setTrial(newTrial)

    return (
        <TrialContext.Provider value={{trial, updateTrial}}>
            {children}
        </TrialContext.Provider>
    );
};

export default TrialContextProvider;