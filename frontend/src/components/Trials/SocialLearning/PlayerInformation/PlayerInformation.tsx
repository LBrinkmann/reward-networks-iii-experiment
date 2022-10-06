import {Paper, Typography} from "@mui/material";
import React, {FC} from "react";

interface PlayerInformationProps {
    /** Player's ID */
    id: number;
    step: number;
    cumulativePoints: number;
    /** Player's comment */
    comment?: string;
}


export const PlayerInformation:FC<PlayerInformationProps> = (props) => {
    return (
        <>
            <Paper sx={{p: 2}} variant="outlined">
                <Typography gutterBottom variant="h4" component="div" align={'center'}>
                    Player {props.id}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                    Step {props.step}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                    Cumulative points {props.cumulativePoints}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                    Comment:
                </Typography>
                <Paper sx={{p: 2, maxHeight: "200px", overflow: 'auto'}}>
                    <Typography variant="body1">
                        {props.comment ? props.comment : "No comment"}
                    </Typography>
                </Paper>
            </Paper>
        </>
    )
}

export default PlayerInformation;