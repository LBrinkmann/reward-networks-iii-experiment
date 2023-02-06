import {Box, Typography} from "@mui/material";
import React from "react";

export const ErrorMessage = () => {
    return (
        <Box
            sx={{width: '25%'}}
            style={{margin: 'auto', marginTop: '20%'}}
            justifyContent="center"
            alignItems="center"
            minHeight="90vh"
        >
            <Typography variant="h6" align={'center'}>
                Something went wrong. Please return the study on Prolific.
            </Typography>
        </Box>
    )
}

export default ErrorMessage;