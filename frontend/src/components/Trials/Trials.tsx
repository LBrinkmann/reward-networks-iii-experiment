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

const TIME_BETWEEN_TRIALS = 1000;


interface ITrial {
    endTrial: (trialResults: postTrialType['trialResults']) => void,
    data: Trial
}


export const ConsentTrial: FC<ITrial> = (props) => {
    return (
        <>
            <Header title={'Consent Form'}/>
            <ConsentForm endTrial={props.endTrial}
                         onDisagreeRedirect={props.data.redirect_url}/>
        </>
    );
};

export const InstructionTrial: FC<ITrial> = (props) => {
    return (
        <>
            <Header title={'Instructions'}/>
            <Instruction endTrial={props.endTrial}
                         instructionType={props.data.instruction_type as keyof typeof instructions}/>
        </>
    );
};

export const PracticeTrial: FC<ITrial> = (props) => {
    const [showTotalScoreTutorial, setShowTotalScoreTutorial] = useState(false);
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.tutorialStep === 5) {
            setShowTotalScoreTutorial(true);
        }
    }, [networkState.tutorialStep]);

    const endTrial = () => {
        props.endTrial({moves: []})
    };

    return (
        <>
            <Header title={'Practice'} showTutorial={showTotalScoreTutorial} onTutorialClose={endTrial}/>
            <NetworkTrial isPractice={true}/>
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
            <Header title={'Learning Selection'} totalPoints={sessionState.totalPoints}/>
            <Selection
                advisors={sessionState.advisors}
                onAdvisorSelected={selectAdvisor}
                showTutorial={sessionState.showTutorialInCurrentTrial}
            />
        </>
    );

}

export const ObservationTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.isNetworkFinished)
            // wait for 4 seconds before submitting the results to give participant time to compare the solutions
            setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
    }, [networkState.isNetworkFinished]);

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution || networkState.isNetworkFinished)
        return <div>loading...</div>
    else
        return (
            <>
                <Header title={'Learning by Watching Example ' +
                    sessionState.selectedAdvisorExampleId + ' Player ' +
                    sessionState.selectedAdvisor.advisorNumber} totalPoints={sessionState.totalPoints}/>
                <Observation solution={props.data.advisor.solution.moves}
                             teacherId={sessionState.selectedAdvisor.advisorNumber}/>
            </>);
}

export const RepeatTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.isNetworkFinished)
            // wait for 4 seconds before submitting the results to give participant time to compare the solutions
            setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
    }, [networkState.isNetworkFinished]);

    if (!networkState.network || !props.data.advisor || !props.data.advisor.solution || networkState.isNetworkFinished)
        return <div>loading...</div>
    else
        return (
            <>
                <Header title={'Learning by Repeating Example ' +
                    sessionState.selectedAdvisorExampleId + ' Player ' +
                    sessionState.selectedAdvisor.advisorNumber} totalPoints={sessionState.totalPoints}/>
                <Repeat solution={props.data.advisor.solution.moves}
                        teacherId={sessionState.selectedAdvisor.advisorNumber}/>
            </>);
}

export const TryYourselfTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();
    const {networkState} = useNetworkContext();

    useEffect(() => {
        if (networkState.isNetworkFinished)
            // wait for 4 seconds before submitting the results to give participant time to compare the solutions
            setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, 4000);
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
        return <div>loading...</div>
    else
        return (
            <>
                <Header title={'Learning by Trying Example ' +
                    sessionState.selectedAdvisorExampleId + ' Player ' +
                    sessionState.selectedAdvisor.advisorNumber} totalPoints={sessionState.totalPoints}/>
                <TryYourself solution={props.data.advisor.solution.moves}
                             teacherTotalScore={calculateScore(props.data.advisor.solution.moves, props.data.network.edges)}
                             teacherId={sessionState.selectedAdvisor.advisorNumber}/>
            </>
        );
}

export const IndividualTrial: FC<ITrial> = (props) => {
    const {networkState} = useNetworkContext();
    const {sessionState} = useSessionContext();

    useEffect(() => {
        if (networkState.isNetworkFinished)
            // wait for 4 seconds before submitting the results to give participant time to compare the solutions
            setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
    }, [networkState.isNetworkFinished]);

    if (!networkState.network || networkState.isNetworkFinished)
        return <div>loading...</div>
    else
        return (
            <>
                <Header title={'Individual Performance'} totalPoints={sessionState.totalPoints}/>
                <NetworkTrial/>
            </>
        );
}

export const DemonstrationTrial: FC<ITrial> = (props) => {
    const {networkState} = useNetworkContext();
    const {sessionState} = useSessionContext();

    useEffect(() => {
        if (networkState.isNetworkFinished)
            // wait for 4 seconds before submitting the results to give participant time to compare the solutions
            setTimeout(() => {
                props.endTrial({moves: networkState.moves})
            }, TIME_BETWEEN_TRIALS);
    }, [networkState.isNetworkFinished]);

    if (!networkState.network || networkState.isNetworkFinished)
        return <div>loading...</div>
    else
        return (
            <>
                <Header title={'Demonstration'} totalPoints={sessionState.totalPoints}/>
                <NetworkTrial/>
            </>
        );
}


export const WrittenStrategyTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();

    return (
        <>
            <Header title={'Written Strategy'} totalPoints={sessionState.totalPoints}/>
            <WrittenStrategy endTrial={props.endTrial}/>
        </>
    );
};

export const PostSurveyTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();
    return (
        <>
            <Header totalPoints={sessionState.totalPoints}/>
            <PostSurvey endTrial={props.endTrial}/>
        </>
    );
}

export const DebriefingTrial: FC<ITrial> = (props) => {
    const {sessionState} = useSessionContext();
    // TODO: post trial on redirect
    return (
        <>
            <Header totalPoints={sessionState.totalPoints}/>
            <Debriefing redirect={props.data.redirect_url}/>
        </>
    );
}

