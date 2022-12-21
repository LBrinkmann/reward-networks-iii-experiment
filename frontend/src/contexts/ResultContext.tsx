import React, {createContext, useState} from "react";
import {Advisor, PostSurvey, Solution, WrittenStrategy} from "../apis/apiTypes";


interface IResultContext {
    result: Solution | Advisor | WrittenStrategy | PostSurvey;
}

const ResultContext = createContext<IResultContext | null>(null);


const ResultContextProvider = ({children}: any) => {
    const [result, setResult] = useState<IResultContext | null>(null);

    return (
        <ResultContext.Provider value={result}>
            {children}
        </ResultContext.Provider>
    );
};

export default ResultContextProvider;