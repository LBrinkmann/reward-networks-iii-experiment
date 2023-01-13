import React, {FC} from "react";

import {InstructionContent} from "./InstructionContent";
import {Box, Button, Grid, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";


interface InstructionInterface {
    instructionId: string;
    endTrial: (data: any) => void;
}


export const Instruction: FC<InstructionInterface> = ({instructionId, endTrial}) => {

    const onClickHandler = () => endTrial({moves: []});

    const renderInstruction = () => {
        // select instruction content based on instructionId
        const content = InstructionContent.filter(c => c.id === instructionId)[0];
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
                                onClick={onClickHandler}
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