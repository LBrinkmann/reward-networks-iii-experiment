import React from "react";
import Trial from "../Trials";
import TrialContextProvider from "../../contexts/TrialContext";


const App = () => {
    return (
        <TrialContextProvider>
            <Trial  nextTrialHandler={() => null}/>
        </TrialContextProvider>
    );
};


export default App;