import React, {FC, useEffect, useState} from "react"
import IndividualTrial, {IndividualTrialInterface} from "../../IndividualTrial/IndividualTrial";
import LinearSolution from "../../../Network/LinearSolution";
import {Box} from "@mui/material";

interface TryYourselfTrialInterface extends IndividualTrialInterface {
    /** The list of moves with the starting node as the first element */
    moves: number[];
    teacherId: number;
    linearSolutionPresentationTime?: number;
}

export const TryYourselfTrial: FC<TryYourselfTrialInterface> = (props) => {
    const {linearSolutionPresentationTime = 3} = props;

    const [currentPlayerMoves, setCurrentPlayerMoves] = useState<number[]>([]);
    const [showLinearNetwork, setShowLinearNetwork] = useState<boolean>(false);

    useEffect(() => {
        if(showLinearNetwork) {
            // wait for `waitBeforeNextTrial` second
            setTimeout(() => {
                // go to the next trial
                props.onNextTrialHandler(currentPlayerMoves);
            }, linearSolutionPresentationTime * 1000);
        }

    }, [showLinearNetwork]);

    const renderLinerSolutions = () => (
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
    )

    const onTrialFinish = (moves: number[]) => {
        setCurrentPlayerMoves(moves)
        setShowLinearNetwork(true)

    }

    return (
        <>
            {
                (showLinearNetwork) ? renderLinerSolutions() :
                    <IndividualTrial  {...props} onNextTrialHandler={onTrialFinish}/>
            }
        </>

    )
}

export default TryYourselfTrial;