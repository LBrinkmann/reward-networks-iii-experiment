import React, {useEffect, useMemo, useState} from "react";
import {useTrial} from "../../apis";
import Header from "../Header/header";


const App = () => {
    const {trialData, loading, error, sendData} = useTrial({method: 'GET'});

    return (
        <>
            <Header />
            {error && (console.log(error))}
            {!loading && !error &&
                (<>
                        <h3>
                            Trial type: {trialData.trial_type}
                        </h3>
                        <h2>
                            Trial number: {trialData.trial_num_in_session}
                        </h2>
                    </>
                )
            }
            <button onClick={() => sendData({method: 'POST'})}>
                Next Trial
            </button>
        </>
    );

    // switch (trialType) {
    //     case 'intro':
    //         return <> </>; // <Intro />
    //     case 'tutorial':
    //         return <> </>; // <Tutorial />
    //     case 'learning':
    //         return <> </>; // <Learning />
    //     case  'advise':
    //         return <> </>; // <Advise />
    //     default:
    //         return <> </>;
    // }
};


export default App;