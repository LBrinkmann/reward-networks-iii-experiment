import React, {FC} from "react";
import {useMutation, useQuery} from "react-query";

// Contexts & APIs
import useNetworkContext from "../../contexts/NetworkContext";
import {NETWORK_ACTIONS} from "../../reducers/NetworkReducer";
import useSessionContext from "../../contexts/SessionContext";
import {SESSION_ACTIONS} from "../../reducers/SessionReducer";
import {getTrial, postTrial, postTrialType} from "../../apis/TrialAPI";
import {useProlificId} from "../App";
import {SessionError, Trial, TrialError, TrialSaved} from "../../apis/apiTypes";

// Data
import {edges as practiceEdges, nodes as practiceNodes} from "./Practice/PracticeData";

// Trials
import {
    ConsentTrial, DebriefingTrial, DemonstrationTrial, IndividualTrial, InstructionTrial, ObservationTrial,
    PostSurveyTrial, PracticeTrial, RepeatTrial, SelectionTrial, TryYourselfTrial, WrittenStrategyTrial
} from "./Trials";
import WaitForNextTrialScreen from "./WaitForNextTrialScreen";
import ErrorMessage from "./ErrorMessage";


export const TRIAL_TYPE = {
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
    const {sessionState, sessionDispatcher} = useSessionContext();

    const onTrialStart = (data: Trial | SessionError) => {
        data = data as Trial;

        // check if data is valid
        if (!data.trial_type) {
            console.error("Invalid trial data", data);
            return;
        }

        // check if the trial was already fetched
        if (data.id === sessionState.currentTrialId) return;

        // update session state
        sessionDispatcher({
            type: SESSION_ACTIONS.SET_CURRENT_TRIAL,
            payload: {
                currentTrialId: data.id,
                currentTrialType: data.trial_type,
                is_practice: data.is_practice,
                practice_count: data.practice_count
            }
        });

        switch (data.trial_type) {
            case TRIAL_TYPE.PRACTICE:
                networkDispatcher({
                    type: NETWORK_ACTIONS.SET_NETWORK,
                    payload: {network: {edges: practiceEdges, nodes: practiceNodes}, isPractice: true}
                });
                break;
            case TRIAL_TYPE.SOCIAL_LEARNING_SELECTION:
                sessionDispatcher({
                    type: SESSION_ACTIONS.SET_ADVISORS,
                    payload: {advisors: data.advisor_selection}
                });
                break;
            case TRIAL_TYPE.OBSERVATION:
            case TRIAL_TYPE.REPEAT:
            case TRIAL_TYPE.TRY_YOURSELF:
            case TRIAL_TYPE.INDIVIDUAL:
            case TRIAL_TYPE.DEMONSTRATION:
                networkDispatcher({
                    type: NETWORK_ACTIONS.SET_NETWORK,
                    payload: {
                        network: {edges: data.network.edges, nodes: data.network.nodes},
                        isPractice: false,
                        teacherComment: data.advisor && data.advisor.written_strategy,
                        // show comment tutorial only for the first observation trial
                        commentTutorial: data.trial_type === TRIAL_TYPE.OBSERVATION &&
                            sessionState.showTutorialInCurrentTrial,
                    }
                });
                break;
            case TRIAL_TYPE.INSTRUCTION:
                // if this is instruction before the first individual trial clean up the total points
                if (data.instruction_type === "individual")
                    sessionDispatcher({type: SESSION_ACTIONS.CLEAN_TOTAL_POINTS});
                break;
            default:
                break;

        }
    }

    const onTrialEnd = (data: TrialSaved | TrialError) => {
        // TODO: handle error
        // console.log("posted data response:", data);
        if ((sessionState.currentTrialType === TRIAL_TYPE.INDIVIDUAL) && !sessionState.isPractice) {
            sessionDispatcher({
                type: SESSION_ACTIONS.UPDATE_TOTAL_POINTS,
                payload: {
                    points: networkState.points ? networkState.points : 0,
                    // NOTE: the max number of steps is assumed to be 8
                    missingSteps: 8 - networkState.step,
                }
            });
        }
        refetch();
    }

    const {status, data, error, refetch} = useQuery(
        "trial",
        () => getTrial(prolificId),
        {onSuccess: onTrialStart});

    const mutation = useMutation(
        (params: postTrialType) => postTrial(params),
        {onSuccess: onTrialEnd})

    const submitResults = (result: postTrialType['trialResults']) => {
        mutation.mutate({prolificID: prolificId, trialId: sessionState.currentTrialId, trialResults: result})
    }

    if (status === "loading") {
        return <WaitForNextTrialScreen newNetwork={false}/>
    } else if (status === "error") {
        console.error(error);
        return <ErrorMessage/>
    } else {
        const trialData = data as Trial;
        // check if data contains an error
        if (!trialData.trial_type) {
            const error = data as SessionError;
            return <ErrorMessage message={error?.message ? error.message : undefined}/>;
        }


        switch (trialData.trial_type) {
            case TRIAL_TYPE.CONSENT:
                return <ConsentTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.INSTRUCTION:
                return <InstructionTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.PRACTICE:
                return <PracticeTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.SOCIAL_LEARNING_SELECTION:
                return <SelectionTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.OBSERVATION:
                return <ObservationTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.REPEAT:
                return <RepeatTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.TRY_YOURSELF:
                return <TryYourselfTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.INDIVIDUAL:
                return <IndividualTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.DEMONSTRATION:
                return <DemonstrationTrial endTrial={submitResults} data={trialData}/>;
            case  TRIAL_TYPE.WRITTEN_STRATEGY:
                return <WrittenStrategyTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.POST_SURVEY:
                return <PostSurveyTrial endTrial={submitResults} data={trialData}/>;
            case TRIAL_TYPE.DEBRIEFING:
                return <DebriefingTrial endTrial={submitResults} data={trialData}/>;
            default:
                return <> </>;
        }
    }

}


export default ExperimentTrial;