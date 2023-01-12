import {ReactQueryDevtools} from 'react-query/devtools'
import React from "react";
import ExperimentTrial from "../Trials";
import TrialContextProvider from "../../contexts/TrialContext";
import {QueryClient, QueryClientProvider} from 'react-query';


// Create a client
const queryClient = new QueryClient()


const App = () => {


    return (
        <QueryClientProvider client={queryClient}>
            <TrialContextProvider>
                <ExperimentTrial/>
            </TrialContextProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
};

export default App;