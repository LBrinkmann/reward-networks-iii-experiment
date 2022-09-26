import React, {useEffect, useState} from "react";
import {useTrialAPI} from "../../apis";
import Header from "../Header";
import WrittenStrategy from "./WrittenStrategy";
import ConsentForm from "./Intro/Concent";
import Selection from "./SocialLearning/Selection";
import DynamicNetwork from "../Network/DynamicNetwork";
import IndividualTrial from "./IndividualTrial";

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
            case 'consent':
                return <ConsentForm onClickHandler={OnNextTrial} />;
            case 'learning_selection':
                return <Selection advisors={trialData.advisors} onClickHandler={OnNextTrial}/>;
            case  'main':
                return <IndividualTrial nodes={trialData.network.nodes} edges={trialData.network.edges}/>;
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