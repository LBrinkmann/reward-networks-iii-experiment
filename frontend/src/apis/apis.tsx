import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import config from "./configLoader";
import {Trial} from "./apiTypes";

axios.defaults.baseURL = config.backendUrl + '/session/';

export const useTrialAPI = () => {
    const [trial, setTrial] = useState<Trial>();
    const [postResponse, setPostResponse] = useState<object>({});
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<AxiosError>();
    const queryProlificIDParamName = "PROLIFIC_PID";

    useEffect(() => {
        if (!searchParams.get(queryProlificIDParamName)) {
            setSearchParams({...searchParams, PROLIFIC_PID: uuid4().toString()});
        }
    }, []);

    useEffect(() => {
        if (searchParams.get(queryProlificIDParamName)) {
            const t = JSON.parse(window.localStorage.getItem('trial'));
            // make axios call to get trial only if there is no trial in local storage
            if (t) {
                setTrial(t);
                setLoading(false);
            } else {
                const fetchData = async () => await axiosGet({});
                fetchData().catch(console.error);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (trial) {
            window.localStorage.setItem('trial', JSON.stringify(trial));
        }
    }, [trial]);

    const axiosGet = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {
            params.method = 'GET';
            params.url = searchParams.get(queryProlificIDParamName);
            params.headers = {accept: '*/*'}
            const result = await axios.request(params);
            setTrial(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const axiosPost = async (params: AxiosRequestConfig) => {
        // SEE issue here: https://stackoverflow.com/questions/48255545/axios-getting-two-requests-options-post
        setLoading(true);
        try {
            params.method = 'POST';
            params.url = searchParams.get(queryProlificIDParamName) + '/' + trial.trial_type;
            params.headers = {"Content-Type": "application/json"}
            const result = await axios.request(params);
            setPostResponse(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    return {trial, error, loading, axiosGet, axiosPost};
}
