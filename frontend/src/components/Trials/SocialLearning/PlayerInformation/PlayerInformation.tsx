import {Paper, TextField, Typography} from "@mui/material";
import React, {FC} from "react";

interface PlayerInformationProps {
    /** Player's ID */
    id: number;
    step: number;
    cumulativePoints: number;
    /** Player's comment */
    comment?: string;
    showComment?: boolean;
}


export const PlayerInformation: FC<PlayerInformationProps> = (props) => {
    const {showComment = true} = props;
    return (
        <>
            <Paper sx={{p: 2}} elevation={0}>
                <Typography gutterBottom variant="h5" component="div">
                    Step {props.step}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    Points {props.cumulativePoints}
                </Typography>
                {(showComment) ? (
                    <Typography gutterBottom variant="h5" component="div">
                        Player {props.id} comment:
                    </Typography>
                ) : null}
            </Paper>
            {(showComment) ? (
                <TextField
                    id="outlined-multiline-static"
                    // label=""
                    multiline
                    fullWidth
                    rows={10}
                    InputProps={{readOnly: true}}
                    defaultValue={props.comment ? props.comment : "No comment"}
                />
            ) : null}
        </>
    )
}

export default PlayerInformation;