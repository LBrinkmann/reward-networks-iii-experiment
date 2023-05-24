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
import Practice from "./Practice";

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
    return (
        <>
            <Header title={'Practice'}/>
            <Practice onLastTutorialStep={() => props.endTrial({moves: []})}/>
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
            <Header title={'Learning Opportunity'}/>
            <Selection
                advisors={sessionState.advisors}
                onAdvisorSelected={selectAdvisor}
                ownScore={sessionState.practiceScore / 2}
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

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution)
        return <WaitForNextTrialScreen newNetwork={false}/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen newNetwork={false}/>
    else
        return (
            <>
                <Header title={`Learning Opportunity | Practice Trial ${sessionState.practiceCount}`}/>
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
        return <WaitForNextTrialScreen newNetwork={false}/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen newNetwork={false}/>
    else
        return (
            <>
                <Header title={`Practice ${sessionState.practiceCount}`}/>
                <Repeat solution={props.data.advisor.solution.moves}
                        teacherId={sessionState.selectedAdvisor.advisorNumber}
                        playerTotalPoints={sessionState.totalPoints}
                />
            </>);
}

export const TryYourselfTrial: FC<ITrial> = (props) => {
    const [isTimeoutAfterLastMoveDone, setIsTimeoutAfterLastMoveDone] = useState(false);
    const {sessionState} = useSessionContext();
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.isNetworkFinished) {
            // wait for 30 seconds before submitting the results to give participant time to compare the solutions
            const timer1 = setTimeout(() => {
                setIsTimeoutAfterLastMoveDone(true);
            }, 30 * 1000);

            return () => clearTimeout(timer1);
        } else {
            setIsTimeoutAfterLastMoveDone(false);
        }
    }, [networkState.isNetworkFinished]);

    useEffect(() => {
        if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone) {
            const timer2 = setTimeout(() => {
                props.endTrial({moves: networkState.moves})
                // wait longer if this is the last trial for the current example
            }, TIME_BETWEEN_TRIALS * (sessionState.lastTrialForCurrentExample ? 2 : 1));
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

    const tryYourselfTrialEndHandler = useCallback(() => {
        // this is necessary to show wait screen
        setIsTimeoutAfterLastMoveDone(true);
    }, [])

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution)
        return <WaitForNextTrialScreen newNetwork={false}/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        // if this is the last trial for the current example, then show the wait screen
        return <WaitForNextTrialScreen newNetwork={sessionState.lastTrialForCurrentExample}/>
    else
        return (
            <>
                <Header title={`Learning Opportunity | Practice Trial ${sessionState.practiceCount}`}/>
                <TryYourself solution={props.data.advisor.solution.moves}
                             teacherTotalScore={calculateScore(props.data.advisor.solution.moves, props.data.network.edges)}
                             teacherId={sessionState.selectedAdvisor.advisorNumber}
                             endTrial={tryYourselfTrialEndHandler}
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
        return <WaitForNextTrialScreen newNetwork={true}/>
    else if (networkState.isNetworkFinished && isTimeoutAfterLastMoveDone)
        return <WaitForNextTrialScreen newNetwork={true}/>
    else
        return (
            <>
                <Header title={sessionState.isPractice ? `Practice ${sessionState.practiceCount}` : 'Main Task'}/>
                <NetworkTrial
                    playerTotalPoints={sessionState.totalPoints}
                    showTotalPoints={!sessionState.isPractice}  // show total points only in non-practice trials
                />
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

