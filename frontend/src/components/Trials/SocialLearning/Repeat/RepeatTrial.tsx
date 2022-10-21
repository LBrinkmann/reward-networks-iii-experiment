import React, {FC} from "react"
import PlayerInformation from "../PlayerInformation";
import LinearSolution from "../../../Network/LinearSolution";
import {HighlightedNetwork, HighlightedNetworkInterface} from "../../../Network/HighlightedNetwork/HighlightedNetwork";
import TrialWithNetworkLayout from "../../TrialWithNetworkLayout";
import Timer from "../../../Timer";
import useNetworkStates from "../../IndividualTrial/NetworkStates";


interface RepeatTrialInterface extends HighlightedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
    /** Handle the end of the trial */
    onNextTrialHandler: () => void;
    maxSteps?: number;
    timer?: number;
}


export const RepeatTrial: FC<RepeatTrialInterface> = (props) => {
    const {maxSteps = 8, timer = 30} = props;

    const {
        step,
        points,
        setIsTimerDone,
        moves,
        onNextStepHandler
    } = useNetworkStates(props.onNextTrialHandler, props.edges, props.nodes, maxSteps)

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
            moves={moves}
            title={""}
        />
    )

    const renderTimer = () => <Timer time={timer} OnTimeEndHandler={() => setIsTimerDone(true)}/>

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