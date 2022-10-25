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
import WaitForNextTrialScreen from "./WaitForNextTrialScreen";
import Instruction from "./Instruction";
import PracticeNetworkTrial from "./PracticeNetworkTrial";

interface TrialInterface {
    nextTrialHandler: () => null;
}

const Trial: React.FC<TrialInterface> = (props) => {
    const {trial, loading, error, axiosGet, axiosPost} = useTrialAPI();

    const [trialType, setTrialType] = useState<string>('');
    const [socialLearningType, setSocialLearningType] = useState<string>('');
    const [waitingForTheNextTrial, setWaitingForTheNextTrial] = useState<boolean>(false);
    const [teacherInx, setTeacherInx] = useState<number>();
    const [learningExampleInx, setLearningExampleInx] = useState<number>(0);

    useEffect(() => {
        const t = JSON.parse(window.localStorage.getItem('teacherInx'));
        if (t) setTeacherInx(t);
        const e = JSON.parse(window.localStorage.getItem('learningExampleInx'));
        if (e) setLearningExampleInx(e);
    }, []);

    useEffect(() => {
        if (trial) {
            // change the trial type only when the trial is changed
            setTrialType(trial.trial_type);
            setSocialLearningType(trial.social_learning_type);
            if (trial.trial_type === 'social_learning_selection') {
                window.localStorage.setItem('learningExampleInx', JSON.stringify(0));
                setLearningExampleInx(0);
            } else if (trial.social_learning_type === 'observation') {
                window.localStorage.setItem('learningExampleInx', JSON.stringify(learningExampleInx + 1));
                setLearningExampleInx(learningExampleInx + 1);
            }
        }
    }, [trial])

    const OnNextTrial = (moves: number[] = [],
                         selectedAdvisorId: string = '',
                         writtenStrategy: string = '') => {
        let payload: {};
        let waitTime = 1000;
        // setup post request payload
        switch (trialType) {
            case 'consent':
                payload = {moves: []};  // TODO: add {consent: true} to payload
                break;
            case 'social_learning_selection':
                payload = {advisor_id: selectedAdvisorId,} as Advisor;
                break;
            case 'individual':
                payload = {moves: moves} as Solution;
                break;
            case 'demonstration':
                payload = {moves: moves} as Solution;
                break;
            case 'social_learning':
                payload = {moves: moves} as Solution;
                break;
            case 'written_strategy':
                payload = {strategy: writtenStrategy} as WrittenStrategyApiTypes;
                break;
        }
        setWaitingForTheNextTrial(true);
        // wait before starting the next trial
        setTimeout(() => {
            setWaitingForTheNextTrial(false);
            axiosPost({data: payload}).then(
                () => {
                    props.nextTrialHandler();
                    axiosGet({});
                }
            )
        }, waitTime);
    }

    const onSocialLearningSelectionClickHandler = (advisorId: string, inx: number) => {
        window.localStorage.setItem('teacherInx', JSON.stringify(inx));
        setTeacherInx(inx);
        OnNextTrial([], advisorId);
    }

    const setHeaderTitle = () => {
        switch (trialType) {
            case 'consent':
                return 'Consent Form';
            case 'social_learning_selection':
                return 'Learning Selection';
            case 'individual':
                return 'Individual Performance';
            case 'demonstration':
                return 'Demonstration';
            case 'social_learning':
                switch (socialLearningType) {
                    case 'observation':
                        return 'Learning By Watching Example ' + learningExampleInx + ' Player ' + teacherInx;
                    case 'repeat':
                        return 'Learning By Repeating Example ' + learningExampleInx + ' Player ' + teacherInx;
                    case 'tryyourself':
                        return 'Learning By Trying Example ' + learningExampleInx + ' Player ' + teacherInx;
                    default:
                        return 'Learning';
                }
            case 'written_strategy':
                return 'Written Strategy';
            case 'debriefing':
                return 'Explanation of the Experiment';
            case 'instruction_welcome':
                return 'Welcome';
            case 'instruction_learning_selection':
                return 'Instruction Learning Selection';
            case 'instruction_learning':
                return 'Instruction Learning';
            case 'instruction_individual':
                return 'Instruction Individual Performance';
            case 'instruction_demonstration':
                return 'Instruction Demonstration';
        }
    }

    const renderTrial = (type: string, data: Trial) => {
        switch (type) {
            case 'consent':
                return <ConsentForm
                    onClickAgreeHandler={OnNextTrial}
                    onDisagreeRedirect={'https://www.prolific.co/'}  // TODO: data.redirect_link
                />;
            case 'instruction_welcome':
                return <Instruction instructionId={"welcome"} onClick={OnNextTrial}/>;
            case 'practice':
                return <PracticeNetworkTrial onNextTrialHandler={OnNextTrial}/>;
            case 'instruction_learning_selection':
                return <Instruction instructionId={"learning_selection"} onClick={OnNextTrial}/>;
            case 'social_learning_selection':
                return <Selection
                    advisors={
                        data.advisor_selection.scores.map((score: number, inx: number) => {
                            return {
                                advisorId: data.advisor_selection.advisor_ids[inx],
                                averageScore: score
                            }
                        })
                    }
                    onClickHandler={onSocialLearningSelectionClickHandler}
                    showTutorial={trial.id === 4}
                />;
            case 'instruction_learning':
                return <Instruction instructionId={"learning"} onClick={OnNextTrial}/>;
            case 'social_learning':
                if (socialLearningType === 'observation') {
                    return <ObservationTrial
                        nodes={data.network.nodes}
                        edges={data.network.edges}
                        moves={data.advisor.solution.moves}
                        teacherId={teacherInx}
                        onNextTrialHandler={OnNextTrial}
                        showTutorial={trial.id === 6}  // show tutorial only for the very first social learning trial
                    />;
                } else if (socialLearningType === 'repeat') {
                    return <RepeatTrial
                        nodes={data.network.nodes}
                        edges={data.network.edges}
                        moves={data.advisor.solution.moves}
                        teacherId={teacherInx}
                        onNextTrialHandler={OnNextTrial}
                    />;
                } else {  // tryyourself
                    return <TryYourselfTrial
                        nodes={data.network.nodes}
                        edges={data.network.edges}
                        moves={data.advisor.solution.moves}
                        teacherId={teacherInx}
                        onNextTrialHandler={OnNextTrial}
                    />;
                }
            case 'instruction_individual':
                return <Instruction instructionId={"individual"} onClick={OnNextTrial}/>;
            case  'individual':
                return <IndividualTrial
                    nodes={data.network.nodes}
                    edges={data.network.edges}
                    onNextTrialHandler={OnNextTrial}
                />;
            case 'instruction_demonstration':
                return <Instruction instructionId={"demonstration"} onClick={OnNextTrial}/>;
            case 'demonstration':
                return <IndividualTrial
                    timer={2 * 60}
                    nodes={data.network.nodes}
                    edges={data.network.edges}
                    onNextTrialHandler={OnNextTrial}
                />;
            case 'instruction_written_strategy':
                return <Instruction instructionId={"written_strategy"} onClick={OnNextTrial}/>;
            case  'written_strategy':
                return <WrittenStrategy onClickContinue={OnNextTrial}/>;
            case 'debriefing':
                return <Debriefing redirect={'https://www.prolific.co/'}/>; // TODO: data.redirect_link
            default:
                return <> </>;
        }
    }

    return (
        <>
            {error && (console.log(error))}
            {!loading && !error && !waitingForTheNextTrial ?
                (
                    <>
                        {/* Hide header for practice trial */}
                        {trialType !== 'practice' && <Header title={setHeaderTitle()}/>}
                        {renderTrial(trialType, trial)}
                    </>
                ) : (<WaitForNextTrialScreen/>)
            }
        </>
    );


};


export default Trial;