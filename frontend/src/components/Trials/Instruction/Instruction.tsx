import React, {FC} from "react";

import {Box, Button, Grid, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import instructions from "./InstructionContent";


interface InstructionInterface {
    endTrial: (data: any) => void;
    instructionType: keyof typeof instructions;
}


export const Instruction: FC<InstructionInterface> = ({endTrial, instructionType}) => {

    const onClickHandler = () => endTrial({moves: []});

    const renderInstruction = () => {
        return (
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Box sx={{width: '65%'}}
                         m="auto" // box margin auto to make box in the center
                         style={{maxHeight: '80vh', overflow: 'auto'}}  //maxHeight: 300,
                         p={3} // box padding
                    >
                        <Typography variant="h5" align='justify'>
                            {instructions[instructionType]}
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