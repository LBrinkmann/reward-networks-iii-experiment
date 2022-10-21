import React from "react";
import {Divider, Grid} from "@mui/material";


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

        <Grid container sx={{margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item sx={{p: 1}} xs={3}>
                <Grid container direction="column">
                    <Grid item xs={4}>
                        {(showTimer) ? (props.timer) : null}
                    </Grid>
                    <Grid item xs={8}>
                        {(showPlayerInformation) ? (props.playerInformation) : null}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <Grid container direction="row" justifyContent="space-around" >
                    <Grid item>
                        {props.network}
                        <Divider variant="middle" light />
                    </Grid>
                    <Grid item sx={{marginTop: '10px'}}>
                        {(showLinearSolution) ? (props.linearSolution) : null}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default TrialWithNetworkLayout;