import React from "react";
import {FC} from "react";
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
import {useMutation, useQuery} from "react-query";
import {getTrial, postTrial, postTrialType} from "../../apis/TrialAPI";
import {useProlificId} from "../App/App";
import NetworkTrial from "./NetworkTrial";
import useNetworkContext from "../../contexts/NetworkContext";

import {edges as practiceEdges, nodes as practiceNodes} from "./NetworkTrial/PracticeData";


const TRIAL_TYPE = {
    CONSENT: "consent",
    INSTRUCTION: "instruction_welcome",
    PRACTICE: "practice",
    INSTRUCTION_LEARNING_SELECTION: "instruction_learning_selection",
    SOCIAL_LEARNING_SELECTION: "social_learning_selection",
}


const ExperimentTrial: FC = () => {
    const prolificId = useProlificId();
    const {networkState, networkDispatcher} = useNetworkContext();
    const {status, data, error, refetch} = useQuery("trial",
        () => getTrial(prolificId),
        {
            onSuccess: (data) => {
                switch (data.trial_type) {
                    case TRIAL_TYPE.PRACTICE:
                        networkDispatcher({
                            type: 'setNetwork',
                            payload: {network: {edges: practiceEdges, nodes: practiceNodes}, isTutorial: true}
                        });
                        break;
                    default:
                        break;

                }
            }
        }
    );
    const mutation = useMutation((params: postTrialType) => postTrial(params),
        {onSuccess: () => refetch()})

    const submitResults = (result: postTrialType['trialResults']) => {
        mutation.mutate({prolificID: prolificId, trialType: data.trial_type, trialResults: result})
    }


    if (status === "loading") {
        return <div>loading...</div>
    } else if (status === "error") {
        return <div>error: {error}</div>
    } else {
        switch (data.trial_type) {
            case TRIAL_TYPE.CONSENT:
                return <ConsentForm endTrial={submitResults} onDisagreeRedirect={data.redirect_url}/>;
            case TRIAL_TYPE.INSTRUCTION:
                return <Instruction endTrial={submitResults} instructionText={"TODO: get text from backend"}/>;
            case TRIAL_TYPE.PRACTICE:
                if (networkState.network) {
                    return <NetworkTrial isPractice={true}/>
                }
                return <>loading...</>;
            // case 'instruction_learning_selection':
            //     return <Instruction instructionId={"learning_selection"}/>;
            // case 'social_learning_selection':
            //     return <Selection
            //         advisors={
            //             data.advisor_selection.scores.map((score: number, inx: number) => {
            //                 return {
            //                     advisorId: data.advisor_selection.advisor_ids[inx],
            //                     averageScore: score
            //                 }
            //             })
            //         }
            //         onClickHandler={onSocialLearningSelectionClickHandler}
            //         showTutorial={data.id === 4}
            //     />;
            // case 'instruction_learning':
            //     return <Instruction instructionId={"learning"}/>;
            // case 'social_learning':
            //     if (socialLearningState.socialLearningType === 'observation') {
            //         return <ObservationTrial
            //             nodes={data.network.nodes}
            //             edges={data.network.edges}
            //             moves={data.advisor.solution.moves}
            //             teacherId={socialLearningState.teacherInx}
            //             onNextTrialHandler={OnNextTrial}
            //             showTutorial={data.id === 6}  // show tutorial only for the very first social learning trial
            //         />;
            //     } else if (socialLearningState.socialLearningType === 'repeat') {
            //         return <RepeatTrial
            //             nodes={data.network.nodes}
            //             edges={data.network.edges}
            //             moves={data.advisor.solution.moves}
            //             teacherId={socialLearningState.teacherInx}
            //             onNextTrialHandler={OnNextTrial}
            //         />;
            //     } else {  // tryyourself
            //         return <TryYourselfTrial
            //             nodes={data.network.nodes}
            //             edges={data.network.edges}
            //             moves={data.advisor.solution.moves}
            //             teacherId={socialLearningState.teacherInx}
            //             onNextTrialHandler={OnNextTrial}
            //         />;
            //     }
            // case 'instruction_individual':
            //     return <Instruction instructionId={"individual"} onClick={OnNextTrial}/>;
            // case  'individual':
            //     return <IndividualTrial
            //         nodes={data.network.nodes}
            //         edges={data.network.edges}
            //         onNextTrialHandler={OnNextTrial}
            //         updateTotalScore={updateTotalPoints}
            //     />;
            // case 'instruction_demonstration':
            //     return <Instruction instructionId={"demonstration"} onClick={OnNextTrial}/>;
            // case 'demonstration':
            //     return <IndividualTrial
            //         timer={2 * 60}
            //         nodes={data.network.nodes}
            //         edges={data.network.edges}
            //         onNextTrialHandler={OnNextTrial}
            //     />;
            // case 'instruction_written_strategy':
            //     return <Instruction instructionId={"written_strategy"} onClick={OnNextTrial}/>;
            // case  'written_strategy':
            //     return <WrittenStrategy onClickContinue={OnNextTrial}/>;
            // case 'post_survey':
            //     return <PostSurvey onContinueHandler={OnNextTrial}/>;
            // case 'debriefing':
            //     return <Debriefing redirect={data.redirect_url}/>;
            default:
                return <> </>;
        }
    }

}


export default ExperimentTrial;