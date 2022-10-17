import {Box, LinearProgress, Typography} from "@mui/material";
import React from "react";

export const WaitForNextTrial = () => {
    return (
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

export default WaitForNextTrial;