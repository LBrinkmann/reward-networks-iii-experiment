import {ReactQueryDevtools} from 'react-query/devtools'
import React, {useContext, useEffect} from "react";
import ExperimentTrial from "../Trials";
import {NetworkContextProvider} from "../../contexts/NetworkContext";
import {QueryClient, QueryClientProvider} from 'react-query';
import {useSearchParams} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import SessionContextProvider from "../../contexts/SessionContext";


// Create a client
const queryClient = new QueryClient()
const ProlificIdContext = React.createContext<string | null>(null);


const App = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get("PROLIFIC_PID")) {
            setSearchParams({...searchParams, PROLIFIC_PID: uuid4().toString()});
        }
    }, []);


    return (
        <QueryClientProvider client={queryClient}>
            <ProlificIdContext.Provider value={searchParams.get("PROLIFIC_PID")}>
                <SessionContextProvider>
                    <NetworkContextProvider>
                        {searchParams.get("PROLIFIC_PID") && <ExperimentTrial/>}
                        <ReactQueryDevtools initialIsOpen={false}/>
                    </NetworkContextProvider>
                </SessionContextProvider>
            </ProlificIdContext.Provider>
        </QueryClientProvider>
    );
};

export default App;

export const useProlificId = () => useContext(ProlificIdContext);