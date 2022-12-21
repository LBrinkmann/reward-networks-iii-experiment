import React, {createContext, useEffect, useState} from "react";
import {Advisor, PostSurvey, Solution, WrittenStrategy} from "../apis/apiTypes";

const LOCAL_STORAGE_KEY = 'resultData';

export type ResultContextType = {
    result: Solution | Advisor | WrittenStrategy | PostSurvey;
    updateResult: (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => void;
}

const ResultContext = createContext<ResultContextType | null>(null);


const ResultContextProvider = ({children}: any) => {
    const [result, setResult] = useState<Solution | Advisor | WrittenStrategy | PostSurvey | null>(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
    }, [result]);

    const updateResult = (newResult: Solution | Advisor | WrittenStrategy | PostSurvey) => setResult(newResult)

    return (
        <ResultContext.Provider value={{result, updateResult}}>
            {children}
        </ResultContext.Provider>
    );
};

export default ResultContextProvider;