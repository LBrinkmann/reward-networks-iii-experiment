import {Paper, TextField, Typography} from "@mui/material";
import React, {FC} from "react";
import TutorialTip from "../../../Tutorial/TutorialTip";

interface PlayerInformationProps {
    /** Player's ID */
    id: number;
    step: number;
    cumulativePoints: number;
    /** Player's comment */
    comment?: string;
    showComment?: boolean;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}


export const PlayerInformation: FC<PlayerInformationProps> = (props) => {
    const {showComment = true, showTutorial = false} = props;
    return (
        <>
            <Paper sx={{p: 2}} elevation={0}>
                <Typography gutterBottom variant="h5" component="div">
                    Step {props.step}
                </Typography>
                <TutorialTip
                    tutorialId={"practice_step_score"}
                    isTutorial={showTutorial}
                    isShowTip={false}
                    onTutorialClose={props.onTutorialClose}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        Points {props.cumulativePoints}
                    </Typography>
                </TutorialTip>
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