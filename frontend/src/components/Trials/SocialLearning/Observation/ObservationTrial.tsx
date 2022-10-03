import React, {FC} from "react"
import {Box, Grid, Paper, Typography} from "@mui/material";
import LinearSolution from "../../../Network/LinearSolution";
import AnimatedNetwork, {AnimatedNetworkInterface} from "../../../Network/AnimatedNetwork/AnimatedNetwork";

interface LinearSolutionTrialInterface extends AnimatedNetworkInterface {
    /** Teacher's ID */
    teacherId: number;
    /** Teacher's comment */
    comment?: string;
}


export const ObservationTrial: FC<LinearSolutionTrialInterface> = (props) => {
    return (
        <Grid container sx={{p: 1, margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item xs={7}>
                <AnimatedNetwork nodes={props.nodes} edges={props.edges} moves={props.moves}/>
            </Grid>

            <Grid item container xs={5} sx={{height: "450px"}} alignItems="stretch" direction="column">
                <Paper sx={{p: 2}} variant="outlined">
                    <Typography gutterBottom variant="h4" component="div" align={'center'}>
                        Player {props.teacherId}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        Step {0}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        Cumulative points {0}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        Total points {0}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        Comment:
                    </Typography>
                    <Paper sx={{p: 2, maxHeight: "200px", overflow: 'auto'}}>
                        <Typography variant="body1">
                            {props.comment ? props.comment : "No comment"}
                        </Typography>
                    </Paper>
                </Paper>
            </Grid>

            <Grid item xs={6} style={{margin: "auto", marginTop: "20px", minWidth: "600px"}}>
                <Paper sx={{p: 2, margin: 2}}>
                    <LinearSolution nodes={props.nodes} edges={props.edges} moves={props.moves}/>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default ObservationTrial;