import React, {useEffect, useState} from "react";
import axios from "axios";

import _ from "lodash";

import {
    State,
    Action,
    Stage,
    StepResult,
    StateUpdate,
    Advise,
    AdviseRequest,
    EvaluatedAction,
} from "../apiTypes";

import Header from "../header";
import Steps from "./steps";
import Game from "./game/game";

export interface Move {
    move: number;
    nodeIdx: number;
    totalReward: number;
}

interface WrapperInterface {
    backendUrl: string;
    externalUserId: string;
}

export interface EvaluatedActions {
    [actionIdx: number]: EvaluatedAction;
}

const ExperimentAPIWrapper = ({
                                  backendUrl,
                                  externalUserId,
                              }: WrapperInterface) => {
    const [experimentState, setExperimentState] = useState(null as State);
    const [stage, setStage] = useState(null as Stage);
    const [stepResult, setStepResult] = useState(null as StepResult);
    const [tutorialIdx, setTutorialIdx] = useState(null as number);
    const [evaluatedActions, setEvaluatedActions] = useState(
        {} as EvaluatedActions
    );

    const onStageFinish = (
        stageIdx: number,
        actions?: Action[],
        points?: number
    ) => {
        if (actions) {
            setStepResult({
                ...stepResult,
                points,
                solution: {
                    actions,
                    environmentId: experimentState.environment.environmentId,
                    stepId: experimentState.step.stepId,
                },
            });
        }
        const {step} = experimentState;
        if (step && step.stages.length <= stageIdx + 1) {
            onStepFinish(stepResult);
        } else {
            setStage(step.stages[stageIdx + 1]);
        }
    };

    const fetchData = async () => {
        axios
            .request({
                url: `${backendUrl}/game/${externalUserId}`,
            })
            .then((response) => {
                setExperimentState(response.data);
            });
    };

    const onStepFinish = async (stepResult: StepResult) => {
        axios
            .request({
                url: `${backendUrl}/step_result`,
                method: "post",
                data: stepResult,
            })
            .then((response) => {
                const stateUpdate = response.data as StateUpdate;
                setExperimentState({...experimentState, ...stateUpdate});
            });
    };

    const onRequestAdvise = async ({move, nodeIdx, totalReward}: Move) => {
        const adviseRequest = {
            move,
            nodeIdx,
            totalReward,
            userId: experimentState.user.userId,
            gameId: experimentState.game.gameId,
            advisor: experimentState.treatment.advisor,
            playout: experimentState.treatment.playout,
            environmentId: experimentState.environment.environmentId,
            phase: experimentState.step.phase,
        } as AdviseRequest;
        axios
            .request({
                url: `${backendUrl}/advise`,
                method: "post",
                data: adviseRequest,
            })
            .then((response) => {
                const evalActions = response.data
                    ? _.keyBy(response.data.actions, ({actionIdx}) => actionIdx)
                    : null;
                setEvaluatedActions(evalActions);
            });
    };

    const onTutorialClose = (idx: number) => {
        if (idx) {
            setTutorialIdx(idx);
        } else {
            setTutorialIdx(null);
            onStageFinish(0);
        }
    };

    useEffect(() => {
        if (externalUserId) {
            fetchData();
        }
    }, [externalUserId]);

    useEffect(() => {
        if (experimentState) {
            const {step} = experimentState;
            setStage(step.stages[0]);
            setStepResult({stepId: step.stepId});
        }
    }, [experimentState]);

    useEffect(() => {
        if (
            experimentState &&
            experimentState.step &&
            experimentState.step.phase == "tutorial"
        ) {
            setTutorialIdx(0);
        } else {
            setTutorialIdx(null);
        }
    }, [experimentState]);

    return (
        <Experiment
            {...experimentState}
            stage={stage}
            tutorialIdx={tutorialIdx}
            onRequestAdvise={onRequestAdvise}
            evaluatedActions={evaluatedActions}
            onTutorialClose={onTutorialClose}
            onStageFinish={onStageFinish}
        />
    );
};

interface ExperimentInterface extends State {
    onStageFinish: (
        stageIdx: number,
        actions?: Action[],
        points?: number
    ) => void;
    onTutorialClose: (tutorialIdx: number) => void;
    tutorialIdx: number;
    stage?: Stage;
    evaluatedActions: EvaluatedActions;
    onRequestAdvise: (move: Move) => void;
}

const Experiment = ({
                        environment,
                        explanations,
                        step,
                        user,
                        game,
                        treatment,
                        tutorialIdx,
                        stage,
                        steps = [],
                        evaluatedActions,
                        onRequestAdvise,
                        onStageFinish,
                        onTutorialClose,
                    }: ExperimentInterface) => {
    const showGame =
        (step && step.phase == "tutorial") || (stage && stage.stageName == "game");
    const showResults = stage && stage.stageName == "results";
    const gameActive = stage && stage.stageName == "game";

    return (
        <>
            <Header
                tutorialIdx={tutorialIdx}
                onTutorialClose={onTutorialClose}
                totalPoints={game ? game.totalPoints : 0}
            />
            <Steps step={step} steps={steps}/>
            {
                environment ? (
                    <Game
                        environment={environment}
                        stage={stage}
                        explanations={explanations}
                        onStageFinish={onStageFinish}
                        showResults={showResults}
                        showGame={showGame}
                        gameActive={gameActive}
                        evaluatedActions={evaluatedActions}
                        onRequestAdvise={onRequestAdvise}
                        tutorialIdx={tutorialIdx}
                        onTutorialClose={onTutorialClose}
                    />
                ) : null
            }
        </>
    );
};

export default ExperimentAPIWrapper;
