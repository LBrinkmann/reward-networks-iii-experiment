import {Trial} from "../../apis/apiTypes";
import ConsentForm from "./Intro/Consent";
import Instruction from "./Instruction";
import PracticeNetworkTrial from "./PracticeNetworkTrial";
import Selection from "./SocialLearning/Selection";
import ObservationTrial from "./SocialLearning/Observation";
import RepeatTrial from "./SocialLearning/Repeat";
import TryYourselfTrial from "./SocialLearning/TryYourself";
import IndividualTrial from "./IndividualTrial";
import WrittenStrategy from "./WrittenStrategy";
import Debriefing from "./Outro/Debriefing";
import React from "react";

// Function to render the trial component based on the trial type
export const renderTrial = (
    type: string,
    socialLearningType: string,
    data: Trial,
    OnNextTrial: () => void,
    onSocialLearningSelectionClickHandler: (advisorId: string, inx: number) => void,
    teacherInx: number,
    updateTotalPoints: (points: number) => void,
) => {
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
                showTutorial={data.id === 4}
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
                    showTutorial={data.id === 6}  // show tutorial only for the very first social learning trial
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
                updateTotalScore={updateTotalPoints}
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

// Function to render correct header based on the trial type
export const setHeaderTitle = (
    trialType: string, socialLearningType: string, learningExampleInx: number, teacherInx: number) => {
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
        case 'instruction_written_strategy':
            return 'Instruction Written Strategy';
    }
}