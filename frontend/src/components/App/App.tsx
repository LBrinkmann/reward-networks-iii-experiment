import React from "react";
import ExperimentTrial from "../Trials";
import TrialContextProvider from "../../contexts/TrialContext";


const App = () => {
    return (
        <TrialContextProvider>
            <ExperimentTrial/>
        </TrialContextProvider>
    );
};

export default App;