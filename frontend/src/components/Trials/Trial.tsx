import React, {useEffect, useState} from "react";
import {useTrialAPI} from "../../apis";
import Header from "../Header";
import WrittenStrategy from "./WrittenStrategy";

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
    const renderTrial = (type: string, data: any) => {
        switch (type) {
            case 'intro':
                return <> </>; // <Intro />
            case 'learning':
                return <> </>; // <Learning />
            case  'main':
                return <WrittenStrategy onClickContinue={OnNextTrial}/>;
            case  'written_strategy':
                return <WrittenStrategy onClickContinue={OnNextTrial}/>;
            default:
                return <> </>;
        }
    }

    return (
        <>
            {error && (console.log(error))}
            {!loading && !error &&
                (
                    <>
                        <Header title={trialType + " – " + trialNumber}/>
                        {renderTrial(trialType, trialData)}
                    </>
                )
            }
        </>
    );


};


export default Trial;