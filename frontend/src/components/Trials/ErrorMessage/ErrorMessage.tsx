import {Alert, AlertTitle, Box, Typography} from "@mui/material";
import React, {FC} from "react";

interface IErrorMessage {
    message?: string
}

export const ErrorMessage: FC<IErrorMessage> = ({message = undefined}) => {

    return (
        <Box
            sx={{width: '40%'}}
            style={{margin: 'auto', marginTop: '20%'}}
            justifyContent="center"
            alignItems="center"
            minHeight="90vh"
        >
            <Alert severity="error">
                {message === undefined ?
                    (
                        <>
                            <AlertTitle>
                                Something went wrong
                            </AlertTitle>
                            Please return the study on Prolific or ask the organizers for support
                        </>
                    ) : (
                        <>
                            <AlertTitle>
                                Error
                            </AlertTitle>
                            {message}
                        </>
                    )
                }
            </Alert>
        </Box>
    )
}

export default ErrorMessage;