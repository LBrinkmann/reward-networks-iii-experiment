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
    const playerInfo = (title: string, content: string) => {
        return (
            <Paper sx={{p: 2, margin: 2}} variant="outlined">
                <Typography gutterBottom variant="h6" component="div">
                    {title}
                </Typography>
                <Typography>
                    {content}
                </Typography>
            </Paper>
        )
    }

    return (
        <Grid container sx={{p: 1, margin: 'auto', width: '85%'}}>
            {/*<Grid item xs={12}>*/}
            {/*    <Typography variant="h4" gutterBottom align={'center'}>*/}
            {/*        You see now the 1st solution of the player 3*/}
            {/*    </Typography>*/}
            {/*</Grid>*/}
            <Grid item xs={6}>
                <AnimatedNetwork nodes={props.nodes} edges={props.edges} moves={props.moves}/>
            </Grid>

            <Grid item xs={6} style={{marginTop: "20px"}}>
                <Box sx={{margin: "auto", minHeight: 300}}>
                    <Typography gutterBottom variant="h5" component="div" align={'center'}>
                        Player {props.teacherId}
                    </Typography>
                    {playerInfo("Total score", "- 230")}
                    {playerInfo("Step", "1")}
                    {playerInfo("Cumulative score", "20")}
                    {playerInfo("Comment", props.comment)}

                </Box>
            </Grid>

            {/*<Grid item xs={6} style={{margin: "auto"}}>*/}
            {/*    <LinearSolution nodes={props.nodes} edges={props.edges} moves={props.moves}/>*/}
            {/*</Grid>*/}
        </Grid>
    );
}

export default ObservationTrial;