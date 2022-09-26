import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTrialAPI} from "../../apis";

interface TrialInterface {

}

const Trial: React.FC<TrialInterface> = (props) => {
    const {trialData, loading, error, sendData} = useTrialAPI({method: 'GET'});

    return (
        <>
            {error && (console.log(error))}
            {!loading && !error &&
                (
                    <>
                        <h3>
                            Trial type: {trialData.trial_type}
                        </h3>
                        <h2>
                            Trial number: {trialData.trial_num_in_session}
                        </h2>
                    </>
                )
            }
            <button onClick={() => sendData({method: 'GET'})}>
                Get Trial
            </button>
            <button onClick={() => sendData({method: 'POST'})}>
                Post Trial
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


export default Trial;