import React, {FC, useEffect, useState} from "react"
import IndividualTrial, {IndividualTrialInterface} from "../../IndividualTrial/IndividualTrial";
import LinearSolution from "../../../Network/LinearSolution";
import {Box, LinearProgress, Typography} from "@mui/material";

interface TryYourselfTrialInterface extends IndividualTrialInterface {
    /** The list of moves with the starting node as the first element */
    moves: number[];
    teacherId: number;
    waitAfterTheEndOfTrial?: number;
}

export const TryYourselfTrial: FC<TryYourselfTrialInterface> = (props) => {
    const {waitAfterTheEndOfTrial = 10, waitBeforeNextTrial = 2} = props;

    const [showSolution, setShowSolution] = useState<boolean>(false);
    const [currentPlayerMoves, setCurrentPlayerMoves] = useState<number[]>([]);
    const [isBlankScreen, setIsBlankScreen] = useState<boolean>(props.hideTrial);

    // Go to the next trial when the timer is done or the subject has done all the steps
    useEffect(() => {
        if (showSolution) {
            setTimeout(() => {
                // hide the trial content
                setIsBlankScreen(true);
            }, waitAfterTheEndOfTrial * 1000);
            // wait for `waitBeforeNextTrial` second
            setTimeout(() => {
                // go to the next trial
                props.onNextTrialHandler(currentPlayerMoves);
            }, waitBeforeNextTrial * 1000);
        }
    }, [showSolution]);

    const onTrialFinish = (moves: number[]) => {
        setCurrentPlayerMoves(moves)
        setShowSolution(true)
    }

    return (
        <>
            {
                (!showSolution) ? (
                    <IndividualTrial  {...props} onTrialEndHandler={onTrialFinish}/>
                ) : (
                    <>
                        {(!isBlankScreen) ? (
                            <Box
                                sx={{width: '600px'}}
                                justifyContent="center"
                                alignItems="center"
                                style={{margin: 'auto', marginTop: '15%'}}
                            >
                                <LinearSolution nodes={props.nodes} edges={props.edges} moves={currentPlayerMoves}
                                                title={"Your solution total score"} id={200}/>
                                <LinearSolution nodes={props.nodes} edges={props.edges} moves={props.moves}
                                                title={"Player " + props.teacherId + " total score"}/>
                            </Box>
                        ) : (
                            <Box
                                sx={{width: '25%'}}
                                style={{margin: 'auto', marginTop: '20%'}}
                                justifyContent="center"
                                alignItems="center"
                                minHeight="90vh"
                            >
                                <Typography variant="h6" align={'center'}>
                                    Waiting for the next trial...
                                </Typography>
                                <LinearProgress/>
                            </Box>
                        )
                        }
                    </>
                )
            }
        </>
    )
}

export default TryYourselfTrial;