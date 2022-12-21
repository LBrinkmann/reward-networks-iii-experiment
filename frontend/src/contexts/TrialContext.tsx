import React, {createContext, useEffect, useState} from "react";
import {Trial} from "../apis/apiTypes";


export const TrialContext = createContext<Trial | null>(null);


const TrialContextProvider = ({children}: any) => {
    const [trial, setTrial] = useState<Trial | null>(JSON.parse(localStorage.getItem('trialData')));

    useEffect(() => {
        localStorage.setItem('trialData', JSON.stringify(trial));
    }, [trial]);

    return (
        <TrialContext.Provider value={trial}>
            {children}
        </TrialContext.Provider>
    );
};
