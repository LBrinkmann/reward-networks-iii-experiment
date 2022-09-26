import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";

axios.defaults.baseURL = 'http://localhost:5000/session/';

export const useTrialAPI = (axiosParamsGet: AxiosRequestConfig) => {
    const [trialData, setTrialData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<AxiosError>();

    const axiosRequest = async (params: AxiosRequestConfig) => {
        setLoading(true);
        try {

            // if (!searchParams.get("userId")) {
            //     setSearchParams({...searchParams, userId: uuid4().toString()});
            // }

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

    // useEffect(() => {
    //     if (!searchParams.get("userId")) {
    //         setSearchParams({...searchParams, userId: uuid4().toString()});
    //     }
    // }, []);

    useEffect(() => {
        if (axiosParamsGet.method === "GET" || axiosParamsGet.method === "get") {
            axiosRequest(axiosParamsGet);
        }
    }, []);

    return {trialData, error, loading, axiosRequest};
}
