import * as React from "react";
import {Typography, Divider, Box, Button} from "@mui/material";

interface ResultsInterface {
    totalReward: number;
    maxReward: number;
    onAccept: () => void;
}

const Results = ({totalReward, maxReward, onAccept}: ResultsInterface) => {
    return (
        <Box sx={{p: 3, textAlign: "center"}}>
            <Typography variant="h2" sx={{m: 1}}>
                Finished
            </Typography>
            <Divider/>
            <Typography variant="h5" sx={{m: 1}}>
                Your total reward in in this round is {totalReward}. The maximum
                reward
                for this environment was {maxReward}.
            </Typography>
            <Divider/>
            <Button
                sx={{m: 1}}
                variant="contained"
                color="secondary"
                onClick={onAccept}
            >
                Ok
            </Button>
        </Box>
    );
};
export default Results;
