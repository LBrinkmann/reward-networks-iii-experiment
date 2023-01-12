import axios from 'axios';
import {Trial} from "./apiTypes";


import config from "./configLoader";

axios.defaults.baseURL = config.backendUrl + '/session/';


export const getTrial = async (prolificID: string) => {
    const {data} = await axios.get<Trial>(`${prolificID}`);
    return data as Trial;
}