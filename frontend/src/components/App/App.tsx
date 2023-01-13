import {ReactQueryDevtools} from 'react-query/devtools'
import React, {useEffect} from "react";
import ExperimentTrial from "../Trials";
import NetworkContextProvider from "../../contexts/NetworkContext";
import {QueryClient, QueryClientProvider} from 'react-query';
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import SessionContextProvider from "../../contexts/SessionContext";


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
            <SessionContextProvider>
                <NetworkContextProvider>
                    <ExperimentTrial prolificId={searchParams.get("PROLIFIC_PID")}/>
                    <ReactQueryDevtools initialIsOpen={false}/>
                </NetworkContextProvider>
            </SessionContextProvider>
        </QueryClientProvider>
    );
};

export default App;