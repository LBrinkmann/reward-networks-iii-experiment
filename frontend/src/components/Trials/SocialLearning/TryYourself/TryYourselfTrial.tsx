import React, {FC, useEffect, useState} from "react"
import IndividualTrial, {IndividualTrialInterface} from "../../IndividualTrial/IndividualTrial";
import LinearSolution from "../../../Network/LinearSolution";
import {Box, Typography} from "@mui/material";

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

    const calculateTotalScore = (moves: number[]) => {
        let score = 0;
        for (let i = 0; i < moves.length - 1; i++) {
            const edge = props.edges.find(e => e.source_num === moves[i] && e.target_num === moves[i + 1]);
            if (edge) {
                score += edge.reward;
            }
        }
        return score;
    }

    const renderLinerSolutions = () => (
        <Box
            sx={{width: '600px'}}
            justifyContent="center"
            alignItems="center"
            style={{margin: 'auto', marginTop: '15%'}}
        >
            <Typography variant="h6" gutterBottom align={'left'}>
                Your solution total score: {calculateTotalScore(currentPlayerMoves)}
            </Typography>
            <LinearSolution nodes={props.nodes} edges={props.edges} moves={currentPlayerMoves} id={200}/>
            <Typography variant="h6" gutterBottom align={'left'}>
                Player {props.teacherId} total score: {calculateTotalScore(props.moves)}
            </Typography>
            <LinearSolution nodes={props.nodes} edges={props.edges} moves={props.moves} />
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