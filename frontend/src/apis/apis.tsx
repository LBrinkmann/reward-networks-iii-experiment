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

    useEffect(() => {
        if (searchParams.get("userId")) {
            const fetchData = async () => await axiosGet({});
            fetchData().catch(console.error);
        }
    }, [searchParams]);

    const axiosGet = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {
            params.method = 'GET';
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

    const axiosPost = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {
            params.method = 'POST';
            params.url = searchParams.get("userId") + '/' + trial.trial_type;
            params.headers = {"Content-Type": "application/json"}
            const result = await axios.request(params);
            setTrial(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    return {trial, error, loading, axiosGet, axiosPost};
}
