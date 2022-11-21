import React, {useEffect, useState} from "react";
import {useTrialAPI} from "../../apis";
import Header from "../Header";
import {
    Advisor,
    Solution,
    WrittenStrategy as WrittenStrategyApiTypes,
    PostSurvey as PostSurveyApiTypes
} from "../../apis/apiTypes";
import WaitForNextTrialScreen from "./WaitForNextTrialScreen";
import {renderTrial, setHeaderTitle} from "./RenderTrialComponent";

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
    // Total points of the player collected in the individual trials
    const [totalPoints, setTotalPoints] = useState<number>(0);

    useEffect(() => {
        const t = JSON.parse(window.localStorage.getItem('teacherInx'));
        if (t) setTeacherInx(t);
        const e = JSON.parse(window.localStorage.getItem('learningExampleInx'));
        if (e) setLearningExampleInx(e);
        const p = JSON.parse(window.localStorage.getItem('totalPoints'));
        if (p) setTotalPoints(p);
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
                         writtenStrategy: string = '',
                         postSurveyAnswers: object = {}) => {
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
            case 'post_survey':
                payload = {questions: postSurveyAnswers} as PostSurveyApiTypes;
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

    const updateTotalPoints = (points: number) => {
        window.localStorage.setItem('totalPoints', JSON.stringify(totalPoints + points));
        setTotalPoints(totalPoints + points);
    }

    return (
        <>
            {error && (console.log(error))}
            {!loading && !error && !waitingForTheNextTrial ?
                (
                    <>
                        {/* Hide header for practice trial */}
                        {trialType !== 'practice' &&
                            <Header
                                title={setHeaderTitle(trialType, socialLearningType, learningExampleInx, teacherInx)}
                                totalPoints={totalPoints}
                            />}
                        {/* Render correct trial */}
                        {
                            renderTrial(
                                trialType,
                                socialLearningType,
                                trial,
                                OnNextTrial,
                                onSocialLearningSelectionClickHandler,
                                teacherInx,
                                updateTotalPoints
                            )
                        }
                    </>
                ) : (<WaitForNextTrialScreen/>)
            }
        </>
    );


};


export default Trial;