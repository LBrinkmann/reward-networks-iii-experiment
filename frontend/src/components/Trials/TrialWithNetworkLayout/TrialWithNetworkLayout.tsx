import React from "react";
import {Box, Grid, LinearProgress, Paper, Typography} from "@mui/material";


interface TrialWithNetworkLayoutInterface {
    network: React.ReactNode;
    timer: React.ReactNode;
    playerInformation: React.ReactNode;
    linearSolution?: React.ReactNode;
}


export const TrialWithNetworkLayout: React.FC<TrialWithNetworkLayoutInterface> = (props) => {

    const [showTrial, setShowTrial] = React.useState<boolean>(true);

    return (
        <>
            {(showTrial) ? (
                <Grid container sx={{p: 1, margin: 'auto', width: '85%'}} justifyContent="space-around">
                    <Grid item xs={7}>
                        {props.network}
                    </Grid>
                    <Grid item xs={4}>
                        {props.timer}
                    </Grid>

                    <Grid item container xs={5} sx={{height: "450px"}} alignItems="stretch" direction="column">
                        {props.playerInformation}
                    </Grid>

                    <Grid item xs={6} style={{margin: "auto", marginTop: "20px", minWidth: "600px"}}>
                        <Paper sx={{p: 2, margin: 2}}>
                            {props.linearSolution}
                        </Paper>
                    </Grid>

                </Grid>) : (
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

export default TrialWithNetworkLayout;