import React from "react";
import {Grid} from "@mui/material";


interface TrialWithNetworkLayoutInterface {
    network: React.ReactNode;
    timer: React.ReactNode;
    playerInformation: React.ReactNode;
    linearSolution?: React.ReactNode;
    showLinearSolution?: boolean;
    showPlayerInformation?: boolean;
    showTimer?: boolean;
}


export const TrialWithNetworkLayout: React.FC<TrialWithNetworkLayoutInterface> = (props) => {
    const {showLinearSolution = true, showPlayerInformation = true, showTimer = true} = props;
    return (

        <Grid container sx={{p: 1, margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item xs={8}>
                <Grid container direction="column" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        {props.network}
                    </Grid>

                    <Grid item>
                        {(showLinearSolution) ? (props.linearSolution) : null}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Grid container direction="column">
                    <Grid item xs={4}>
                        {(showTimer) ? (props.timer) : null}
                    </Grid>
                    <Grid item xs={8}>
                        {(showPlayerInformation) ? (props.playerInformation) : null}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default TrialWithNetworkLayout;