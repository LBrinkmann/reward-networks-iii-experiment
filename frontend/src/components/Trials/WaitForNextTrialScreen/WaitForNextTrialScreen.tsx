import {Box, LinearProgress, Typography} from "@mui/material";
import React, {FC} from "react";

interface IWaitForNextTrialScreen {
    newNetwork?: boolean;
}

export const WaitForNextTrialScreen: FC<IWaitForNextTrialScreen> = ({newNetwork = true}) => {
    return (
        <Box
            sx={{width: '45%'}}
            style={{margin: 'auto', marginTop: '20%'}}
            justifyContent="center"
            alignItems="center"
            minHeight="90vh"
        >
            <Typography variant="h6" align={'center'} mb={"20px"}>
                {newNetwork ? ("Please wait while a new network is loaded for you to solve" ): ("Please wait")}
            </Typography>
            <LinearProgress/>
        </Box>
    )
}

export default WaitForNextTrialScreen;