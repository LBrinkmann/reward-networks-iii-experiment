import React, {FC, useEffect} from "react";
import {useMutation, useQuery} from "react-query";

import {getTrial, postTrial, postTrialType} from "../../apis/TrialAPI";

import {useProlificId} from "../App";

import ConsentForm from "./Consent";
import Instruction from "./Instruction";
import WrittenStrategy from "./WrittenStrategy";
import PostSurvey from "./PostSurvey";
import Repeat from "./Repeat";
import Observation from "./Observation";
import Debriefing from "./Debriefing";
import NetworkTrial from "./NetworkTrial";
import useNetworkContext from "../../contexts/NetworkContext";

import {edges as practiceEdges, nodes as practiceNodes} from "./NetworkTrial/PracticeData";
import instructions from "./Instruction/InstructionContent";


const TRIAL_TYPE = {
    // before the experiment
    CONSENT: "consent",
    INSTRUCTION: "instruction",
    PRACTICE: "practice",
    // Social learning selection
    SOCIAL_LEARNING_SELECTION: "social_learning_selection",
    // Network trials
    OBSERVATION: "observation",
    REPEAT: "repeat",
    TRY_YOURSELF: "try_yourself",
    INDIVIDUAL: "individual",
    DEMONSTRATION: "demonstration",
    // after the experiment
    WRITTEN_STRATEGY: "written_strategy",
    POST_SURVEY: "post_survey",
    DEBRIEFING: "debriefing",
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

    useEffect(() => {
        if (networkState.isNetworkFinished &&
            (
                data.trial_type === TRIAL_TYPE.PRACTICE ||
                data.trial_type === TRIAL_TYPE.INDIVIDUAL ||
                data.trial_type === TRIAL_TYPE.OBSERVATION ||
                data.trial_type === TRIAL_TYPE.REPEAT ||
                data.trial_type === TRIAL_TYPE.TRY_YOURSELF ||
                data.trial_type === TRIAL_TYPE.DEMONSTRATION
            )) {
            submitResults({moves: networkState.moves})
        }
    }, [networkState.isNetworkFinished]);


    if (status === "loading") {
        return <div>loading...</div>
    } else if (status === "error") {
        return <div>error: {error}</div>
    } else {
        switch (data.trial_type) {
            case TRIAL_TYPE.CONSENT:
                return <ConsentForm endTrial={submitResults} onDisagreeRedirect={data.redirect_url}/>;
            case TRIAL_TYPE.INSTRUCTION:
                return <Instruction endTrial={submitResults}
                                    instructionType={data.instruction_type as keyof typeof instructions}/>;
            case TRIAL_TYPE.PRACTICE:
                return <NetworkTrial isPractice={true}/>;
            case TRIAL_TYPE.SOCIAL_LEARNING_SELECTION:
                return <> </>; // <Selection />
            case TRIAL_TYPE.OBSERVATION:
                return <Observation solution={data.solution.moves}/>;
            case TRIAL_TYPE.REPEAT:
                return <Repeat solution={data.solution.moves}/>;
            case TRIAL_TYPE.TRY_YOURSELF:
                return  <> </>; // <TryYourself/>;
            case TRIAL_TYPE.INDIVIDUAL:
                return <NetworkTrial/>;
            case TRIAL_TYPE.DEMONSTRATION:
                return <> </>; // <Demonstration/>;
            case  TRIAL_TYPE.WRITTEN_STRATEGY:
                return <WrittenStrategy onClickContinue={()=>{}}/>;
            case TRIAL_TYPE.POST_SURVEY:
                return <PostSurvey onContinueHandler={()=>{}}/>;
            case TRIAL_TYPE.DEBRIEFING:
                return <Debriefing redirect={data.redirect_url}/>;
            default:
                return <> </>;
        }
    }

}


export default ExperimentTrial;