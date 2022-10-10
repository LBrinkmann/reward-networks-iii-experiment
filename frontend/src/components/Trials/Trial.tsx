import React, {useEffect, useState} from "react";
import {useTrialAPI} from "../../apis";
import Header from "../Header";
import WrittenStrategy from "./WrittenStrategy";
import ConsentForm from "./Intro/Consent";
import Selection from "./SocialLearning/Selection";
import IndividualTrial from "./IndividualTrial";
import ObservationTrial from "./SocialLearning/Observation";
import RepeatTrial from "./SocialLearning/Repeat";
import TryYourselfTrial from "./SocialLearning/TryYourself";
import {Advisor, Solution, WrittenStrategy as WrittenStrategyApiTypes, Trial} from "../../apis/apiTypes";
import Debriefing from "./Outro/Debriefing";

interface TrialInterface {
    nextTrialHandler: () => null;
}

const Trial: React.FC<TrialInterface> = (props) => {
    const {trial, loading, error, axiosGet, axiosPost} = useTrialAPI();
    const [trialType, setTrialType] = useState<string>('');
    const [socialLearningStage, setSocialLearningStage] = useState<number>(1);

    useEffect(() => {
        setTrialType(trial?.trial_type);
    }, [trial])

    const OnNextTrial = (moves: number[] = [],
                         selectedAdvisorId: string = '',
                         selectedAdvisorDemoTrialId: number = 0,
                         writtenStrategy: string = '') => {
        let payload: {};
        switch (trialType) {
            case 'consent':
                payload = {moves: []};  // TODO: add {consent: true} to payload
                break;
            case 'social_learning_selection':
                payload = {
                    advisor_id: selectedAdvisorId,
                    demonstration_trial_id: selectedAdvisorDemoTrialId
                } as Advisor;
                break;
            case 'individual':
                payload = {moves: moves} as Solution;
                break;
            case 'demonstration':
                payload = {moves: moves} as Solution;
                break;
            case 'social_learning':
                payload = {moves: moves} as Solution;
                setSocialLearningStage(socialLearningStage > 2 ? 1 : socialLearningStage + 1);
                break;
            case 'written_strategy':
                payload = {strategy: writtenStrategy} as WrittenStrategyApiTypes;
                break;
            case 'debriefing':
                payload = {moves: []};
                break;
        }

        axiosPost({data: payload}).then(
            () => {
                props.nextTrialHandler();
                axiosGet({});
            }
        )
    }

    const onConsentFormClickAgreeHandler = () => {
        OnNextTrial([], '', 0);
    }

    const onSocialLearningSelectionClickHandler = (advisorId: string, demoTrialId: number) => {
        OnNextTrial([], advisorId, demoTrialId);
    }

    const renderTrial = (type: string, data: Trial) => {
        switch (type) {
            case 'consent':
                return <ConsentForm
                    onClickAgreeHandler={onConsentFormClickAgreeHandler}
                    onClickDisagreeHandler={() => null}
                />;
            case 'social_learning_selection':
                return <Selection
                    advisors={
                        data.advisor_selection.scores.map((score: number, inx: number) => {
                            return {
                                advisorInx: data.advisor_selection.advisor_demo_trial_ids[inx],
                                advisorId: data.advisor_selection.advisor_ids[inx],
                                averageScore: score
                            }
                        })
                    }
                    onClickHandler={onSocialLearningSelectionClickHandler}
                />;
            case 'social_learning':
                if (socialLearningStage === 1) {
                    return <ObservationTrial
                        nodes={data.network.nodes}
                        edges={data.network.edges}
                        moves={data.advisor.solution.moves}
                        teacherId={1}  // TODO: set correct teacher id
                        onNextTrialHandler={OnNextTrial}
                    />;
                } else if (socialLearningStage === 2) {
                    return <RepeatTrial
                        nodes={data.network.nodes}
                        edges={data.network.edges}
                        moves={data.advisor.solution.moves}
                        teacherId={1}  // TODO: set correct teacher id
                        onNextTrialHandler={OnNextTrial}
                    />;
                } else {
                    console.log(data.network.nodes);
                    return <TryYourselfTrial
                        nodes={data.network.nodes}
                        edges={data.network.edges}
                        moves={data.advisor.solution.moves}
                        teacherId={1}  // TODO: set correct teacher id
                        onNextTrialHandler={OnNextTrial}
                    />;
                }
            case  'individual':
                return <IndividualTrial
                    nodes={data.network.nodes}
                    edges={data.network.edges}
                    onNextTrialHandler={OnNextTrial}
                />;
            case 'demonstration':
                return <IndividualTrial
                    timer={2 * 60}
                    nodes={data.network.nodes}
                    edges={data.network.edges}
                    onNextTrialHandler={OnNextTrial}
                />;
            case  'written_strategy':
                return <WrittenStrategy onClickContinue={OnNextTrial}/>;
            case 'debriefing':
                 return <Debriefing onClickHandler={OnNextTrial} />;
            default:
                return <> </>;
        }
    }

    return (
        <>
            {error && (console.log(error))}
            {!loading && !error ?
                (
                    <>
                        <Header title={"Trial: " + trialType}/>
                        {renderTrial(trialType, trial)}
                    </>
                ) : (
                    // TODO: add loading screen
                    <div>Loading...</div>
                )
            }
        </>
    );


};


export default Trial;