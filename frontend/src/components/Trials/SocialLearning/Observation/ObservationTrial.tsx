import React, {FC, useEffect, useState} from "react"
import LinearSolution from "../../../Network/LinearSolution";
import AnimatedNetwork, {AnimatedNetworkInterface} from "../../../Network/AnimatedNetwork/AnimatedNetwork";
import PlayerInformation from "../PlayerInformation";
import TrialWithNetworkLayout from "../../TrialWithNetworkLayout";
import useNetworkStates from "../../IndividualTrial/NetworkStates";

interface ObservationTrialInterface extends AnimatedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
    maxSteps?: number;
    /** Handle the end of the trial */
    onNextTrialHandler: () => void;
}


export const ObservationTrial: FC<ObservationTrialInterface> = (props) => {
    const {maxSteps = 8} = props;

    const {
        step,
        points,
        onNextStepHandler
    } = useNetworkStates(props.onNextTrialHandler, props.edges, maxSteps)

    const [playAnimation, setPlayAnimation] = useState<boolean>(false);

    // wait for 2 seconds before starting the animation
    useEffect(() => {
        setTimeout(() => {
            setPlayAnimation(true);
        }, 2000);
    }, []);

    const renderNetwork = () => (
        <AnimatedNetwork
            nodes={props.nodes}
            edges={props.edges}
            moves={props.moves}
            onNextStepHandler={onNextStepHandler}
            playAnimation={step < maxSteps ? playAnimation : false}
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