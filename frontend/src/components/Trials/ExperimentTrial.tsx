import React from "react";
import {FC} from "react";
import {useTrialContext} from "../../contexts/TrialContext";
import ConsentForm from "./Intro/Consent";
import Instruction from "./Instruction";
import PracticeNetworkTrial from "./PracticeNetworkTrial";
import Selection from "./SocialLearning/Selection";
import ObservationTrial from "./SocialLearning/Observation";
import RepeatTrial from "./SocialLearning/Repeat";
import TryYourselfTrial from "./SocialLearning/TryYourself";
import IndividualTrial from "./IndividualTrial";
import WrittenStrategy from "./WrittenStrategy";
import PostSurvey from "./Outro/PostSurvey";
import Debriefing from "./Outro/Debriefing";


const ExperimentTrial: FC = () => {
    const {trial, socialLearningState, updateResult, updateSocialLearningState, updateSessionState} = useTrialContext();

    const OnNextTrial = () => {
        // updateResult
    }

    const onSocialLearningSelectionClickHandler = (advisorId: string, inx: number) => {
        // updateSocialLearningState
    }

    const updateTotalPoints = (points: number) => {
        // updateSessionState
    }

    switch (trial.trial_type) {
        case 'consent':
            return <ConsentForm
                onClickAgreeHandler={OnNextTrial}
                onDisagreeRedirect={trial.redirect_url}
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
                    trial.advisor_selection.scores.map((score: number, inx: number) => {
                        return {
                            advisorId: trial.advisor_selection.advisor_ids[inx],
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
            if (socialLearningState.socialLearningType === 'observation') {
                return <ObservationTrial
                    nodes={trial.network.nodes}
                    edges={trial.network.edges}
                    moves={trial.advisor.solution.moves}
                    teacherId={socialLearningState.teacherInx}
                    onNextTrialHandler={OnNextTrial}
                    showTutorial={trial.id === 6}  // show tutorial only for the very first social learning trial
                />;
            } else if (socialLearningState.socialLearningType === 'repeat') {
                return <RepeatTrial
                    nodes={trial.network.nodes}
                    edges={trial.network.edges}
                    moves={trial.advisor.solution.moves}
                    teacherId={socialLearningState.teacherInx}
                    onNextTrialHandler={OnNextTrial}
                />;
            } else {  // tryyourself
                return <TryYourselfTrial
                    nodes={trial.network.nodes}
                    edges={trial.network.edges}
                    moves={trial.advisor.solution.moves}
                    teacherId={socialLearningState.teacherInx}
                    onNextTrialHandler={OnNextTrial}
                />;
            }
        case 'instruction_individual':
            return <Instruction instructionId={"individual"} onClick={OnNextTrial}/>;
        case  'individual':
            return <IndividualTrial
                nodes={trial.network.nodes}
                edges={trial.network.edges}
                onNextTrialHandler={OnNextTrial}
                updateTotalScore={updateTotalPoints}
            />;
        case 'instruction_demonstration':
            return <Instruction instructionId={"demonstration"} onClick={OnNextTrial}/>;
        case 'demonstration':
            return <IndividualTrial
                timer={2 * 60}
                nodes={trial.network.nodes}
                edges={trial.network.edges}
                onNextTrialHandler={OnNextTrial}
            />;
        case 'instruction_written_strategy':
            return <Instruction instructionId={"written_strategy"} onClick={OnNextTrial}/>;
        case  'written_strategy':
            return <WrittenStrategy onClickContinue={OnNextTrial}/>;
        case 'post_survey':
            return <PostSurvey onContinueHandler={OnNextTrial}/>;
        case 'debriefing':
            return <Debriefing redirect={trial.redirect_url}/>;
        default:
            return <> </>;
    }

}


export default ExperimentTrial;