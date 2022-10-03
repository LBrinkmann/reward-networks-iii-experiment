import React, {FC} from "react"
import {Grid} from "@mui/material";
import LinearSolution from "../../../Network/LinearSolution";
import AnimatedNetwork, {AnimatedNetworkInterface} from "../../../Network/AnimatedNetwork/AnimatedNetwork";

interface LinearSolutionTrialInterface extends AnimatedNetworkInterface{

}


export const ObservationTrial:FC<LinearSolutionTrialInterface> = (props) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <AnimatedNetwork nodes={props.nodes} edges={props.edges} moves={props.moves} />
            </Grid>

            <Grid item xs={12}>
                <LinearSolution nodes={props.nodes} edges={props.edges} moves={props.moves} />
            </Grid>
        </Grid>
    );
}

export default ObservationTrial;