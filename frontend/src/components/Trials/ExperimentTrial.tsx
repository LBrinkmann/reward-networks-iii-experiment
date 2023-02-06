import React, {FC} from "react";
import {useMutation, useQuery} from "react-query";

// Contexts & APIs
import useNetworkContext from "../../contexts/NetworkContext";
import {NETWORK_ACTIONS} from "../../reducers/NetworkReducer";
import useSessionContext from "../../contexts/SessionContext";
import {SESSION_ACTIONS} from "../../reducers/SessionReducer";
import {getTrial, postTrial, postTrialType} from "../../apis/TrialAPI";
import {useProlificId} from "../App";
import {Trial} from "../../apis/apiTypes";

// Data
import {edges as practiceEdges, nodes as practiceNodes} from "./NetworkTrial/PracticeData";

// Trials
import {
    ConsentTrial, DebriefingTrial, DemonstrationTrial, IndividualTrial, InstructionTrial, ObservationTrial,
    PostSurveyTrial, PracticeTrial, RepeatTrial, SelectionTrial, TryYourselfTrial, WrittenStrategyTrial
} from "./Trials";
import WaitForNextTrialScreen from "./WaitForNextTrialScreen";


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

    const onTrialStart = (data: Trial) => {
        // check if the trial was already fetched
        if (data.id === sessionState.currentTrialId) return;

        // update session state
        sessionDispatcher({
            type: SESSION_ACTIONS.SET_CURRENT_TRIAL,
            payload: {currentTrialId: data.id, currentTrialType: data.trial_type}
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
            default:
                break;

        }
    }

    const onTrialEnd = () => {
        if (sessionState.currentTrialType === TRIAL_TYPE.INDIVIDUAL) {
            sessionDispatcher({
                type: SESSION_ACTIONS.UPDATE_TOTAL_POINTS,
                payload: {points: networkState.points ? networkState.points : 0}
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
        mutation.mutate({prolificID: prolificId, trialType: data.trial_type, trialResults: result})
    }

    if (status === "loading") {
        return <WaitForNextTrialScreen/>
    } else if (status === "error") {
        return <div>error: {error}</div>
    } else {
        switch (data.trial_type) {
            case TRIAL_TYPE.CONSENT:
                return <ConsentTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.INSTRUCTION:
                return <InstructionTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.PRACTICE:
                return <PracticeTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.SOCIAL_LEARNING_SELECTION:
                return <SelectionTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.OBSERVATION:
                return <ObservationTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.REPEAT:
                return <RepeatTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.TRY_YOURSELF:
                return <TryYourselfTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.INDIVIDUAL:
                return <IndividualTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.DEMONSTRATION:
                return <DemonstrationTrial endTrial={submitResults} data={data}/>;
            case  TRIAL_TYPE.WRITTEN_STRATEGY:
                return <WrittenStrategyTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.POST_SURVEY:
                return <PostSurveyTrial endTrial={submitResults} data={data}/>;
            case TRIAL_TYPE.DEBRIEFING:
                return <DebriefingTrial endTrial={submitResults} data={data}/>;
            default:
                return <> </>;
        }
    }

}


export default ExperimentTrial;