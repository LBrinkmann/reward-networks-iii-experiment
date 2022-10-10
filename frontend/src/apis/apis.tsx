import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import config from "./configLoader";
import {Trial} from "./apiTypes";

axios.defaults.baseURL = config.backendUrl + '/session/';

export const useTrialAPI = () => {
    const [trial, setTrial] = useState<Trial>();
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<AxiosError>();

    useEffect(() => {
        if (!searchParams.get("userId")) {
            setSearchParams({...searchParams, userId: uuid4().toString()});
        }
    }, []);

    const axiosGetRequest = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {
            params.url = searchParams.get("userId");
            params.headers = {accept: '*/*'}
            const result = await axios.request(params);
            setTrial(result.data);
            console.log(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const axiosPostRequest = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {
            params.url = searchParams.get("userId") + '/' + trial.trial_type;
            params.headers = {accept: '*/*'}
            const result = await axios.request(params);
            setTrial(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    return {trial, error, loading, axiosGetRequest, axiosPostRequest};
}
