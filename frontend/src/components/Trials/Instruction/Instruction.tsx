import React, {FC} from "react";

import {InstructionContent} from "./InstructionContent";
import {Box, Button, Grid, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {ExperimentTrialsProps} from "../ExperimentTrial";

interface InstructionInterface extends ExperimentTrialsProps{
    instructionId: string;
}


export const Instruction: FC<InstructionInterface> = props => {

    const renderInstruction = () => {
        // select instruction content based on instructionId
        const content = InstructionContent.filter(c => c.id === props.instructionId)[0];
        return (
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Box sx={{width: '65%'}}
                         m="auto" // box margin auto to make box in the center
                         style={{maxHeight: '80vh', overflow: 'auto'}}  //maxHeight: 300,
                         p={3} // box padding
                    >
                        <Typography variant="h5" align='justify'>
                            {content.text}
                        </Typography>

                        <Grid item xs={12} textAlign={"center"} p={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => props.onTrialFinished({moves: []})}
                                startIcon={<CheckIcon/>}>️
                                Continue
                            </Button>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        )
    }


    return (
        <>
            {renderInstruction()}
        </>
    )
}

export default Instruction