import React, {FC, useEffect, useState} from "react"
import {Box, Grid, Paper, Typography} from "@mui/material";
import LinearSolution from "../../../Network/LinearSolution";
import AnimatedNetwork, {AnimatedNetworkInterface} from "../../../Network/AnimatedNetwork/AnimatedNetwork";
import PlayerInformation from "../PlayerInformation";

interface LinearSolutionTrialInterface extends AnimatedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
}


export const ObservationTrial: FC<LinearSolutionTrialInterface> = (props) => {
    const [step, setStep] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [startAnimation, setStartAnimation] = useState<boolean>(false);

    // wait for 2 seconds before starting the animation
    useEffect(() => {
        setTimeout(() => {
            setStartAnimation(true);
        }, 2000);
    }, []);

    const onNextStepHandler = (stepNumber: number, cumulativeScore: number) => {
        setStep(stepNumber);
        setPoints(cumulativeScore);
    }

    return (
        <Grid container sx={{p: 1, margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item xs={7}>
                <AnimatedNetwork
                    nodes={props.nodes}
                    edges={props.edges}
                    moves={props.moves}
                    onNextStepHandler={onNextStepHandler}
                    startAnimation={startAnimation}
                />
            </Grid>

            <Grid item container xs={5} sx={{height: "450px"}} alignItems="stretch" direction="column">
                <PlayerInformation
                    step={step}
                    cumulativePoints={points}
                    id={props.teacherId}
                    comment={props.comment}/>
            </Grid>

            <Grid item xs={6} style={{margin: "auto", marginTop: "20px", minWidth: "600px"}}>
                <Paper sx={{p: 2, margin: 2}}>
                    <LinearSolution
                        nodes={props.nodes}
                        edges={props.edges}
                        moves={props.moves}
                        title={"Player " + props.teacherId + " total score"}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default ObservationTrial;