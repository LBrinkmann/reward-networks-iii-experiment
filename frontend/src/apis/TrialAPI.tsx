import axios from 'axios';
import {Advisor, PostSurvey, Solution, Trial, WrittenStrategy} from "./apiTypes";


import config from "./configLoader";

axios.defaults.baseURL = config.backendUrl + '/session/';

export type postTrialType = {
    prolificID: string,
    trialType: string,
    trialResults: Solution | Advisor | WrittenStrategy | PostSurvey
}


export const getTrial = async (prolificID: string) => {
    const {data} = await axios.get<Trial>(`${prolificID}`);
    return data as Trial;
}

export const postTrial = async (params: postTrialType) => {
    await axios.post(`${params.prolificID}/${params.trialType}`, params.trialResults);
}