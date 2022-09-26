import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import config from "./config";

axios.defaults.baseURL = config.backend_url + '/session/';

export const useTrialAPI = (axiosParamsGet: AxiosRequestConfig) => {
    const [trialData, setTrialData] = useState<any>();
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
            if (axiosParamsGet.method === "GET" || axiosParamsGet.method === "get") {
                axiosRequest(axiosParamsGet);
            }
        }
    }, [searchParams]);

    const axiosRequest = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {
            params.url = searchParams.get("userId");
            params.headers = {
                accept: '*/*'
            }
            const result = await axios.request(params);
            setTrialData(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {trialData, error, loading, axiosRequest};
}
