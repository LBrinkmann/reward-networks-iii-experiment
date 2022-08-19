import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";

axios.defaults.baseURL = 'http://localhost:5000/session/';

export const useTrial = (axiosParamsGet: AxiosRequestConfig) => {
    const [trialData, setTrialData] = useState<any>();
    const [error, setError] = useState<AxiosError>();
    const [loading, setLoading] = useState(axiosParamsGet.method === "GET" || axiosParamsGet.method === "get");
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchData = async (params: AxiosRequestConfig) => {
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

    const sendData = (axiosParamsPost: AxiosRequestConfig) => {
        fetchData(axiosParamsPost);
    }

    useEffect(() => {
        if (!searchParams.get("userId")) {
            setSearchParams({...searchParams, userId: uuid4()});
        }
    }, []);

    useEffect(() => {
        if (axiosParamsGet.method === "GET" || axiosParamsGet.method === "get") {
            fetchData(axiosParamsGet);
        }
    }, []);

    return {trialData, error, loading, sendData};
}
