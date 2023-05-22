import React, {FC, useCallback, useEffect, useState} from "react";

import {Trial} from "../../apis/apiTypes";
import {postTrialType} from "../../apis/TrialAPI";

import Header from "../Header";

// Contexts
import useNetworkContext from "../../contexts/NetworkContext";
import useSessionContext from "../../contexts/SessionContext";
import {SESSION_ACTIONS} from "../../reducers/SessionReducer";

// Trials
import ConsentForm from "./Consent";
import Instruction from "./Instruction";
import WrittenStrategy from "./WrittenStrategy";
import PostSurvey from "./PostSurvey";
import Repeat from "./Repeat";
import Observation from "./Observation";
import Debriefing from "./Debriefing";
import NetworkTrial from "./NetworkTrial";
import Selection from "./Selection";
import TryYourself from "./TryYourself";
import instructions from "./Instruction/InstructionContent";
import {StaticNetworkEdgeInterface} from "../Network/StaticNetwork/StaticNetwork";
import WaitForNextTrialScreen from "./WaitForNextTrialScreen";

const TIME_BETWEEN_TRIALS = 1000;
const TIME_AFTER_LAST_STEP = 2000;


interface ITrial {
    endTrial: (trialResults: postTrialType['trialResults']) => void,
    data: Trial
}


export const ConsentTrial: FC<ITrial> = (props) => {
    return (
        <>
            <Header title={'Consent Form'}/>
            <ConsentForm endTrial={props.endTrial} onDisagreeRedirect={props.data.redirect_url}/>
        </>
    );
};

export const InstructionTrial: FC<ITrial> = (props) => {
    return (
        <>
            <Header title={props.data.instruction_type === "welcome" ? 'Overview' : 'Instructions'}/>
            <Instruction endTrial={props.endTrial}
                         instructionType={props.data.instruction_type as keyof typeof instructions}/>
        </>
    );
};

export const PracticeTrial: FC<ITrial> = (props) => {
    const [showTotalScoreTutorial, setShowTotalScoreTutorial] = useState(false);
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.tutorialStep === 5 && !networkState.tutorialOptions.time) {
            setShowTotalScoreTutorial(true);
        }
    }, [networkState.tutorialStep, networkState.tutorialOptions.time]);

    const endTrial = () => {
        props.endTrial({moves: []})
    };

    return (
        <>
            <Header title={'Practice'}/>
            <NetworkTrial isPractice={true} playerTotalPoints={0}/>
        </>
    );
}

export const SelectionTrial: FC<ITrial> = (props) => {
    const {sessionState, sessionDispatcher} = useSessionContext();

    const selectAdvisor = (advisorId: string, advisorNumber: number) => {
        sessionDispatcher({
            type: SESSION_ACTIONS.SET_SELECTED_ADVISOR,
            payload: {selectedAdvisor: {advisorId: advisorId, advisorNumber: advisorNumber}}
        });
        props.endTrial({advisor_id: advisorId})
    }

    return (
        <>
            <Header title={'Learning Selection'}/>
            <Selection
                advisors={sessionState.advisors}
                onAdvisorSelected={selectAdvisor}
                ownScore={sessionState.totalPoints / 2}
                showTutorial={sessionState.showTutorialInCurrentTrial}
            />
        </>
    );

}

export const ObservationTrial: FC<ITrial> = (props) => {
    const [isTimeoutAfterLastMoveDone, setIsTimeoutAfterLastMoveDone] = useState(false);
    const {networkState} = useNetworkContext();
    const {sessionState} = useSessionContext();

    useEffect(() => {
        if (networkState.isNetworkFinished) {
            const timer1 = setTimeout(() => {
                setIsTimeoutAfterLastMoveDone(true);
            }, TIME_AFTER_LAST_STEP);
            return () => clearTimeout(timer1);
        } else {
            setIsTimeoutAfterLastMoveDone(false);
        }
    }, [networkState.isNetworkFinished]);

    useEffect(() => {
        if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone) {
            const timer2 = setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
            return () => clearTimeout(timer2);
        }
    }, [networkState.isNetworkFinished, isTimeoutAfterLastMoveDone]);

    const calculateScore = useCallback((moves: number[], edges: StaticNetworkEdgeInterface[]) => {
        let score = 0;
        for (let i = 0; i < moves.length - 1; i++) {
            const edge = edges.find(e => e.source_num === moves[i] && e.target_num === moves[i + 1]);
            if (edge) {
                score += edge.reward;
            }
        }
        return score;
    }, []);

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution)
        return <WaitForNextTrialScreen/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen/>
    else
        return (
            <>
                <Header title={'Learning by Watching Example ' +
                    sessionState.selectedAdvisorExampleId + ' Player ' +
                    sessionState.selectedAdvisor.advisorNumber}/>
                <Observation solution={props.data.advisor.solution.moves}
                             teacherId={sessionState.selectedAdvisor.advisorNumber}
                             playAnimation={!networkState.tutorialOptions.comment}
                             playerTotalPoints={sessionState.totalPoints}
                />
            </>);
}

export const RepeatTrial: FC<ITrial> = (props) => {
    const [isTimeoutAfterLastMoveDone, setIsTimeoutAfterLastMoveDone] = useState(false);
    const {networkState} = useNetworkContext();
    const {sessionState} = useSessionContext();

    useEffect(() => {
        if (networkState.isNetworkFinished) {
            const timer1 = setTimeout(() => {
                setIsTimeoutAfterLastMoveDone(true);
            }, TIME_AFTER_LAST_STEP);
            return () => clearTimeout(timer1);
        } else {
            setIsTimeoutAfterLastMoveDone(false);
        }
    }, [networkState.isNetworkFinished]);

    useEffect(() => {
        if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone) {
            const timer2 = setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
            return () => clearTimeout(timer2);
        }
    }, [networkState.isNetworkFinished, isTimeoutAfterLastMoveDone]);

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution)
        return <WaitForNextTrialScreen/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen/>
    else
        return (
            <>
                <Header title={'Learning by Repeating Example ' +
                    sessionState.selectedAdvisorExampleId + ' Player ' +
                    sessionState.selectedAdvisor.advisorNumber} />
                <Repeat solution={props.data.advisor.solution.moves}
                        teacherId={sessionState.selectedAdvisor.advisorNumber}
                        playerTotalPoints={sessionState.totalPoints}
                />
            </>);
}

export const TryYourselfTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.isNetworkFinished) {
            // wait for 30 seconds before submitting the results to give participant time to compare the solutions
            const timer1 = setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, 30 * 1000);

            return () => clearTimeout(timer1);
        }
    }, [networkState.isNetworkFinished]);

    const calculateScore = useCallback((moves: number[], edges: StaticNetworkEdgeInterface[]) => {
        let score = 0;
        for (let i = 0; i < moves.length - 1; i++) {
            const edge = edges.find(e => e.source_num === moves[i] && e.target_num === moves[i + 1]);
            if (edge) {
                score += edge.reward;
            }
        }
        return score;
    }, []);

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution)
        return <WaitForNextTrialScreen/>
    else
        return (
            <>
                <Header title={'Learning by Trying Example ' +
                    sessionState.selectedAdvisorExampleId + ' Player ' +
                    sessionState.selectedAdvisor.advisorNumber} />
                <TryYourself solution={props.data.advisor.solution.moves}
                             teacherTotalScore={calculateScore(props.data.advisor.solution.moves, props.data.network.edges)}
                             teacherId={sessionState.selectedAdvisor.advisorNumber}
                             endTrial={props.endTrial}
                             teacherWrittenSolution={props.data.advisor.written_strategy}
                             playerTotalPoints={sessionState.totalPoints}
                />
            </>
        );
}

export const IndividualTrial: FC<ITrial> = (props) => {
    const [isTimeoutAfterLastMoveDone, setIsTimeoutAfterLastMoveDone] = useState(false);
    const {networkState} = useNetworkContext();
    const {sessionState} = useSessionContext();

    useEffect(() => {
        if (networkState.isNetworkFinished) {
            const timer1 = setTimeout(() => {
                setIsTimeoutAfterLastMoveDone(true);
            }, TIME_AFTER_LAST_STEP);
            return () => clearTimeout(timer1);
        } else {
            setIsTimeoutAfterLastMoveDone(false);
        }
    }, [networkState.isNetworkFinished]);

    useEffect(() => {
        if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone) {
            const timer2 = setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
            return () => clearTimeout(timer2);
        }
    }, [networkState.isNetworkFinished, isTimeoutAfterLastMoveDone]);

    if (!networkState.network)
        return <WaitForNextTrialScreen/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen/>
    else
        return (
            <>
                <Header title={'Individual Performance'}/>
                <NetworkTrial playerTotalPoints={sessionState.totalPoints}/>
            </>
        );
}

export const DemonstrationTrial: FC<ITrial> = (props) => {
    const [isTimeoutAfterLastMoveDone, setIsTimeoutAfterLastMoveDone] = useState(false);
    const {networkState} = useNetworkContext();
    const {sessionState} = useSessionContext();

    useEffect(() => {
        if (networkState.isNetworkFinished) {
            const timer1 = setTimeout(() => {
                setIsTimeoutAfterLastMoveDone(true);
            }, TIME_AFTER_LAST_STEP);
            return () => clearTimeout(timer1);
        } else {
            setIsTimeoutAfterLastMoveDone(false);
        }
    }, [networkState.isNetworkFinished]);

    useEffect(() => {
        if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone) {
            const timer2 = setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
            return () => clearTimeout(timer2);
        }
    }, [networkState.isNetworkFinished, isTimeoutAfterLastMoveDone]);

    if (!networkState.network)
        return <WaitForNextTrialScreen/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen/>
    else
        return (
            <>
                <Header title={'Demonstration'}/>
                <NetworkTrial playerTotalPoints={sessionState.totalPoints}/>
            </>
        );
}


export const WrittenStrategyTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();

    return (
        <>
            <Header title={'Written Strategy'}/>
            <WrittenStrategy endTrial={props.endTrial} type={sessionState.currentTrialId < 10 ? "start" : "end"}/>
        </>
    );
};

export const PostSurveyTrial: FC<ITrial> = (props) => {
    return (
        <>
            <Header/>
            <PostSurvey endTrial={props.endTrial}/>
        </>
    );
}

export const DebriefingTrial: FC<ITrial> = (props) => {
    // TODO: post trial on redirect
    return (
        <>
            <Header/>
            <Debriefing redirect={props.data.redirect_url}/>
        </>
    );
}

