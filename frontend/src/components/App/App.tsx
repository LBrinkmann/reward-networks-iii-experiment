import React from "react";
import Trial from "../Trials";
import TrialContextProvider from "../../contexts/TrialContext";
import ResultContextProvider from "../../contexts/ResultContext";


const App = () => {
    return (
        <TrialContextProvider>
            <ResultContextProvider>
                <Trial nextTrialHandler={() => null}/>
            </ResultContextProvider>
        </TrialContextProvider>
    );
};

export default App;