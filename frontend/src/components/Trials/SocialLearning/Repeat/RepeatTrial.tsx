import React, {FC, useEffect, useState} from "react"
import PlayerInformation from "../PlayerInformation";
import LinearSolution from "../../../Network/LinearSolution";
import {HighlightedNetwork, HighlightedNetworkInterface} from "../../../Network/HighlightedNetwork/HighlightedNetwork";
import TrialWithNetworkLayout from "../../TrialWithNetworkLayout";
import Timer from "../../IndividualTrial/Timer";


interface RepeatTrialInterface extends HighlightedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
    maxSteps?: number;
    hideTrial?: boolean;
    waitBeforeNextTrial?: number;
    waitAfterTheEndOfTrial?: number;
    /** Handle the end of the trial */
    onNextTrialHandler: () => void;
    timer?: number;
}


export const RepeatTrial: FC<RepeatTrialInterface> = (props) => {
    const {maxSteps = 8, timer = 30} = props;

    const [step, setStep] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);

    // Go to the next trial when all the steps are done
    useEffect(() => {
        if (step === maxSteps) {
            props.onNextTrialHandler();
        }
    }, [step]);

    const onNextStepHandler = (stepNumber: number, cumulativeScore: number) => {
        setStep(stepNumber);
        setPoints(cumulativeScore);
    }

    const renderNetwork = () => (
        <HighlightedNetwork
            nodes={props.nodes}
            edges={props.edges}
            moves={props.moves}
            onNextStepHandler={onNextStepHandler}
        />
    )

    const renderPlayerInformation = () => (
        <PlayerInformation
            step={step}
            cumulativePoints={points}
            id={props.teacherId}
            comment={props.comment}
        />
    )

    const renderLinearSolution = () => (
        <LinearSolution
            nodes={props.nodes}
            edges={props.edges}
            moves={props.moves}
            title={"Player " + props.teacherId + " total score"}
        />
    )

    const renderTimer = () => <Timer time={timer} OnTimeEndHandler={() => {
        setStep(maxSteps)
    }}/>

    return (
        <TrialWithNetworkLayout
            network={renderNetwork()}
            timer={renderTimer()}
            playerInformation={renderPlayerInformation()}
            linearSolution={renderLinearSolution()}
            showTimer={true}
            showPlayerInformation={true}
            showLinearSolution={true}
        />
    );
}

export default RepeatTrial;