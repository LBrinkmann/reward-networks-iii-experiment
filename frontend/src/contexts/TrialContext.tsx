import React from 'react';
import {useMutation, useQuery} from "react-query";
import {createContext, useContext} from "react";
import {ProlificIdContext} from "./ProlificIdContext";
import {getTrial, postTrial, postTrialType} from "../apis/TrialAPI";
import {Advisor, PostSurvey, Solution, WrittenStrategy} from "../apis/apiTypes";

export const useTrial = () => {
    const prolificId = useContext(ProlificIdContext);

    return useQuery("trial", () => getTrial(prolificId))
}


type resultContextType = {
    submitResults: (results: Solution | Advisor | WrittenStrategy | PostSurvey) => void
}

const ResultsContext = createContext<resultContextType | null>(null);

export const ResultContextProvider = ({children}: any) => {
    const prolificId = useContext(ProlificIdContext);
    const {data, refetch} = useTrial();

    const mutation = useMutation((params: postTrialType) => postTrial(params),
    {onSuccess: () => refetch()})

    const submitResults = (result: Solution | Advisor | WrittenStrategy | PostSurvey) => {
        mutation.mutate({
            prolificID: prolificId,
            trialType: data.trial_type,
            trialResults: result
        })
    }

    return (
        <ResultsContext.Provider value={{submitResults}}>
            {children}
        </ResultsContext.Provider>
    );
};

export const useResults = () => useContext(ResultsContext);



