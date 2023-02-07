import axios from 'axios';
import {Advisor, PostSurvey, SessionError, Solution, Trial, WrittenStrategy} from "./apiTypes";


import config from "./configLoader";

// axios.defaults.baseURL = config.backendUrl + '/session/';
// for testing
axios.defaults.baseURL = config.backendUrl +  '/session_error/';

export type postTrialType = {
    prolificID: string,
    trialType: string,
    trialResults: Solution | Advisor | WrittenStrategy | PostSurvey
}


export const getTrial = async (prolificID: string) => {
    // const {data} = await axios.get<Trial>(`${prolificID}`);
    // for testing error

    // const {data} = await axios.get<Trial | SessionError>(`${prolificID}?error_id=0`);
    // const {data} = await axios.get<Trial | SessionError>(`${prolificID}?error_id=1`);
    const {data} = await axios.get<Trial | SessionError>(`${prolificID}?error_id=2`);
    return data as Trial | SessionError;
}

export const postTrial = async (params: postTrialType) => {
    await axios.post(`${params.prolificID}/${params.trialType}`, params.trialResults);
}