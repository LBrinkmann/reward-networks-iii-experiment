import React from "react";
import {Grid, Paper} from "@mui/material";
import DynamicNetwork from "../../Network/DynamicNetwork";
import {DynamicNetworkInterface} from "../../Network/DynamicNetwork/DynamicNetwork";


export interface IndividualTrialInterface extends DynamicNetworkInterface {

}

const IndividualTrial: React.FC<IndividualTrialInterface> = (props) => {
    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 550,
                flexGrow: 1
            }}
        >
            <Grid sx={{flexGrow: 1}} direction="column" container spacing={8} justifyContent="center"
                  alignItems="center">
                <Grid item alignItems="center" style={{textAlign: "center"}}>
                    <DynamicNetwork nodes={props.nodes} edges={props.edges}/>
                </Grid>
                <Grid item>
                    Step 0
                    Cumulative Points 0
                </Grid>

            </Grid>
        </Paper>
    );
};


export default IndividualTrial;