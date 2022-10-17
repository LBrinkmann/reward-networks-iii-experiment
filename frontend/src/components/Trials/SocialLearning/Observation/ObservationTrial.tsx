import React, {FC, useEffect, useState} from "react"
import LinearSolution from "../../../Network/LinearSolution";
import AnimatedNetwork, {AnimatedNetworkInterface} from "../../../Network/AnimatedNetwork/AnimatedNetwork";
import PlayerInformation from "../PlayerInformation";
import TrialWithNetworkLayout from "../../TrialWithNetworkLayout";

interface ObservationTrialInterface extends AnimatedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
    maxSteps?: number;
    hideTrial?: boolean;
    waitBeforeNextTrial?: number;
    waitAfterTheEndOfAnimation?: number;
    /** Handle the end of the trial */
    onNextTrialHandler: () => void;
}


export const ObservationTrial: FC<ObservationTrialInterface> = (props) => {
    const {maxSteps = 8} = props;

    const [step, setStep] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [startAnimation, setStartAnimation] = useState<boolean>(false);

    // wait for 2 seconds before starting the animation
    useEffect(() => {
        setTimeout(() => {
            setStartAnimation(true);
        }, 2000);
    }, []);

    // Go to the next trial when all the steps are done
    useEffect(() => {
        if (step === maxSteps) {
            // go to the next trial
            props.onNextTrialHandler();
        }
    }, [step]);

    const onNextStepHandler = (stepNumber: number, cumulativeScore: number) => {
        setStep(stepNumber);
        setPoints(cumulativeScore);
    }

    const renderNetwork = () => (
        <AnimatedNetwork
            nodes={props.nodes}
            edges={props.edges}
            moves={props.moves}
            onNextStepHandler={onNextStepHandler}
            startAnimation={startAnimation}
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

    return (
        <TrialWithNetworkLayout
            network={renderNetwork()}
            timer={<> </>}
            playerInformation={renderPlayerInformation()}
            linearSolution={renderLinearSolution()}
            showTimer={false}
            showPlayerInformation={true}
            showLinearSolution={true}
        />
    );
}

export default ObservationTrial;