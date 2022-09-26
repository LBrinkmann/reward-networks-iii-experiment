import React, {useEffect, useState} from "react";
import {useTrialAPI} from "../../apis";
import Header from "../Header";

interface TrialInterface {
    nextTrialHandler: () => null;
}

const Trial: React.FC<TrialInterface> = (props) => {
    const {trialData, loading, error, axiosRequest} = useTrialAPI({method: 'GET'});
    const [trialType, setTrialType] = useState<string>('');
    const [trialNumber, setTrialNumber] = useState<number>(0);

    useEffect(() => {
        setTrialType(trialData?.trial_type);
        setTrialNumber(trialData?.trial_num_in_session);
    }, [trialData]);

    const OnNextTrial = () => {
        axiosRequest({method: 'POST'}).then(
            () => {
                props.nextTrialHandler();
                axiosRequest({method: 'GET'});
            }
        )
    }

    return (
        <>
            {error && (console.log(error))}
            {!loading && !error &&
                (
                    <>
                        <Header title={trialType + " – " + trialNumber}/>
                    </>
                )
            }

            <button onClick={OnNextTrial}>
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


export default Trial;