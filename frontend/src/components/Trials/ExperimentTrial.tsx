import React, {FC, useCallback, useEffect} from "react";
import {useMutation, useQuery} from "react-query";

// Trials
import ConsentForm from "./Consent";
import Instruction from "./Instruction";
import WrittenStrategy from "./WrittenStrategy";
import PostSurvey from "./PostSurvey";
import Repeat from "./Repeat";
import Observation from "./Observation";
import Debriefing from "./Debriefing";
import NetworkTrial from "./NetworkTrial";
import useNetworkContext from "../../contexts/NetworkContext";
import Selection from "./Selection";
import TryYourself from "./TryYourself";

// Utils
import {NETWORK_ACTIONS} from "../../reducers/NetworkReducer";
import {useSessionContext} from "../../contexts/SessionContext";
import {SESSION_ACTIONS} from "../../reducers/SessionReducer";
import {getTrial, postTrial, postTrialType} from "../../apis/TrialAPI";
import {useProlificId} from "../App";

// Data
import {edges as practiceEdges, nodes as practiceNodes} from "./NetworkTrial/PracticeData";
import instructions from "./Instruction/InstructionContent";
import {StaticNetworkEdgeInterface} from "../Network/StaticNetwork/StaticNetwork";


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
    const {sessionState, sessionDispatcher} = useSessionContext();

    const {status, data, error, refetch} = useQuery("trial",
        () => getTrial(prolificId),
        {
            onSuccess: (data) => {
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
                                teacherComment: data.advisor.written_strategy,
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
        }
    );
    const mutation = useMutation((params: postTrialType) => postTrial(params),
        {onSuccess: () => refetch()})

    const submitResults = (result: postTrialType['trialResults']) => {
        mutation.mutate({prolificID: prolificId, trialType: data.trial_type, trialResults: result})
    }

    useEffect(() => {
        if (networkState.isNetworkFinished &&
            (data.trial_type === TRIAL_TYPE.PRACTICE ||
                data.trial_type === TRIAL_TYPE.INDIVIDUAL ||
                data.trial_type === TRIAL_TYPE.OBSERVATION ||
                data.trial_type === TRIAL_TYPE.REPEAT ||
                data.trial_type === TRIAL_TYPE.DEMONSTRATION
            )) submitResults({moves: networkState.moves})

        if (networkState.isNetworkFinished && data.trial_type === TRIAL_TYPE.TRY_YOURSELF)
            // wait for 4 seconds before submitting the results to give participant time to compare the solutions
            setTimeout(() => {
                submitResults({moves: networkState.moves})
            }, 4000);

    }, [networkState.isNetworkFinished]);


    const selectAdvisor = (advisorId: string, advisorNumber: number) => {
        sessionDispatcher({
            type: SESSION_ACTIONS.SET_SELECTED_ADVISOR,
            payload: {selectedAdvisor: {advisorId: advisorId, advisorNumber: advisorNumber}}
        });
        submitResults({advisor_id: advisorId})
    }


    const calculateScore = useCallback( (moves: number[], edges: StaticNetworkEdgeInterface[]) => {
        let score = 0;
        for (let i = 0; i < moves.length - 1; i++) {
            const edge = edges.find(e => e.source_num === moves[i] && e.target_num === moves[i + 1]);
            if (edge) {
                score += edge.reward;
            }
        }
        return score;
    }, []);


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
                return <Selection
                    advisors={sessionState.advisors}
                    onAdvisorSelected={selectAdvisor}
                    showTutorial={sessionState.showTutorialInCurrentTrial}
                />;
            case TRIAL_TYPE.OBSERVATION:
                if (!networkState.network)
                    return <div>loading...</div>
                return <Observation solution={data.solution.moves}
                                    teacherId={sessionState.selectedAdvisor.advisorNumber}/>;
            case TRIAL_TYPE.REPEAT:
                if (!networkState.network)
                    return <div>loading...</div>
                return <Repeat solution={data.solution.moves}
                               teacherId={sessionState.selectedAdvisor.advisorNumber}/>;
            case TRIAL_TYPE.TRY_YOURSELF:
                if (!networkState.network)
                    return <div>loading...</div>
                return <TryYourself solution={data.solution.moves}
                                    teacherTotalScore={calculateScore(data.solution.moves, data.network.edges)}
                                    teacherId={sessionState.selectedAdvisor.advisorNumber}/>;
            case TRIAL_TYPE.INDIVIDUAL:
                if (!networkState.network)
                    return <div>loading...</div>
                return <NetworkTrial/>;
            case TRIAL_TYPE.DEMONSTRATION:
                if (!networkState.network)
                    return <div>loading...</div>
                return <> </>; // <Demonstration/>;
            case  TRIAL_TYPE.WRITTEN_STRATEGY:
                return <WrittenStrategy onClickContinue={() => {
                }}/>;
            case TRIAL_TYPE.POST_SURVEY:
                return <PostSurvey onContinueHandler={() => {
                }}/>;
            case TRIAL_TYPE.DEBRIEFING:
                return <Debriefing redirect={data.redirect_url}/>;
            default:
                return <> </>;
        }
    }

}


export default ExperimentTrial;