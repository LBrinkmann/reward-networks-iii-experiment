import {ReactQueryDevtools} from 'react-query/devtools'
import React, {useEffect} from "react";
import ExperimentTrial from "../Trials";
import TrialContextProvider from "../../contexts/TrialContext";
import {QueryClient, QueryClientProvider} from 'react-query';
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";


// Create a client
const queryClient = new QueryClient()


const App = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get("PROLIFIC_PID")) {
            setSearchParams({...searchParams, PROLIFIC_PID: uuid4().toString()});
        }
    }, []);


    return (
        <QueryClientProvider client={queryClient}>
            <TrialContextProvider>
                <TrialContextProvider>
                    <ExperimentTrial prolificId={searchParams.get("PROLIFIC_PID")}/>
                </TrialContextProvider>
            </TrialContextProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
};

export default App;