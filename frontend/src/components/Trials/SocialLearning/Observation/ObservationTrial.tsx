import React, {FC, useEffect, useState} from "react"
import LinearSolution from "../../../Network/LinearSolution";
import AnimatedNetwork, {AnimatedNetworkInterface} from "../../../Network/AnimatedNetwork/AnimatedNetwork";
import PlayerInformation from "../PlayerInformation";
import TrialWithNetworkLayout from "../../TrialWithNetworkLayout";
import useNetworkStates from "../../IndividualTrial/NetworkStates";
import TutorialTip from "../../../Tutorial/TutorialTip";
import StaticNetwork from "../../../Network/StaticNetwork";
import {Box, Typography} from "@mui/material";

interface ObservationTrialInterface extends AnimatedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
    maxSteps?: number;
    /** Handle the end of the trial */
    onNextTrialHandler: () => void;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}


export const ObservationTrial: FC<ObservationTrialInterface> = (props) => {
    const {maxSteps = 8, showTutorial = false} = props;

    const {
        step,
        points,
        moves,
        onNextStepHandler
    } = useNetworkStates(props.onNextTrialHandler, props.edges, props.nodes, maxSteps)

    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    // show tutorial only if the animation is not already playing
    const [isTutorial, setIsTutorial] = useState<boolean>(showTutorial && step === 0);
    const [tutorialId, setTutorialId] = useState<number>(1);

    const onTooltipClick = () => {
        setTutorialId(tutorialId + 1)
    }

    const onLastTooltipClick = () => {
        setIsTutorial(false);
    }

    // wait for 2 seconds before starting the animation
    useEffect(() => {
        if (!isTutorial) {
            setTimeout(() => {
                setPlayAnimation(true);
            }, 4000);
        }
    }, [isTutorial]);

    const renderNetwork = () => {
        if (isTutorial) {
            return (
                <TutorialTip
                    tutorialId={"social_learning_observation_animation"}
                    isTutorial={showTutorial && tutorialId === 2}
                    isShowTip={false}
                    onTutorialClose={onLastTooltipClick}
                    placement={"left"}
                >
                    {/* Box is necessary to show tooltip properly */}
                    <Box>
                        <StaticNetwork
                            edges={props.edges}
                            nodes={props.nodes}
                            currentNodeId={moves[0]}
                            possibleMoves={[]}
                            size={460}
                            onNodeClickHandler={null}
                            blur={true}
                        />
                    </Box>
                </TutorialTip>
            )
        } else {
            return (<AnimatedNetwork
                nodes={props.nodes}
                edges={props.edges}
                moves={props.moves}
                onNextStepHandler={onNextStepHandler}
                playAnimation={step < maxSteps ? playAnimation : false}
            />)
        }

    }

    const renderPlayerInformation = () => (
        <PlayerInformation
            step={step}
            cumulativePoints={points}
            id={props.teacherId}
            comment={props.comment}
            showTutorialComment={showTutorial && tutorialId === 1}
            onTutorialClose={onTooltipClick}
        />
    )

    const renderLinearSolution = () => (
        <LinearSolution
            nodes={props.nodes}
            edges={props.edges}
            moves={moves}
        />
    )

    return (
        <>
            <Typography variant="h3" align='center'>
                Watch player {props.teacherId} solve the task
            </Typography>
            <TrialWithNetworkLayout
                network={renderNetwork()}
                timer={<> </>}
                playerInformation={renderPlayerInformation()}
                linearSolution={renderLinearSolution()}
                showTimer={false}
                showPlayerInformation={true}
                showLinearSolution={true}
            />
        </>
    );
}

export default ObservationTrial;