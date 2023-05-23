import {Divider, Paper, Stack, TextField, Typography} from "@mui/material";
import React, {FC} from "react";
import TutorialTip from "../../Tutorial/TutorialTip";
import styled from "@emotion/styled";

interface PlayerInformationProps {
    /** Player's ID */
    id: number;
    step: number;
    cumulativePoints: number;
    totalScore: number;
    /** Player's comment */
    comment?: string;
    showComment?: boolean;
    /** show tutorial tip */
    showTutorialScore?: boolean;
    showTutorialComment?: boolean;
    showTutorialTotalScore?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialCommentClose?: () => void;
    onTutorialClose?: () => void;
}

const Item = styled(Paper)(() => ({
    padding: 0,
    elevation: 0,
    textAlign: 'left',
}));

const PlayerInfoItem: FC = ({children}) => {
    return (
        <Item elevation={0}>
            {children}
            {/*<Divider/>*/}
        </Item>
    )
};


export const PlayerInformation: FC<PlayerInformationProps> = (props) => {
    const {showComment = true, showTutorialScore = false, showTutorialComment = false, showTutorialTotalScore = false} = props;
    return (

        <Stack spacing={0} sx={{paddingTop: "20px"}}>
            <Typography variant="h4" component="div">
                Points
            </Typography>
            <PlayerInfoItem>
                <TutorialTip
                    tutorialId={"practice_step_score"}
                    isTutorial={showTutorialScore}
                    isShowTip={false}
                    onTutorialClose={props.onTutorialClose}
                >
                    <Typography variant="subtitle1" component="div">
                        Current Network: {props.cumulativePoints}
                    </Typography>
                </TutorialTip>
            </PlayerInfoItem>
            <PlayerInfoItem>
                <TutorialTip
                    tutorialId={"practice_total_score"}
                    isTutorial={showTutorialTotalScore}
                    isShowTip={false}
                    onTutorialClose={props.onTutorialClose}
                >
                    <Typography variant="subtitle1" component="div">
                        Total: {props.totalScore}
                    </Typography>
                </TutorialTip>
            </PlayerInfoItem>
            {(showComment) ? (
                <PlayerInfoItem>
                    <Typography gutterBottom variant="subtitle1" component="div">
                        Player {props.id} comment:
                    </Typography>

                    <TutorialTip
                        tutorialId={"social_learning_observation_comment"}
                        isTutorial={showTutorialComment}
                        isShowTip={false}
                        onTutorialClose={props.onTutorialCommentClose}
                        placement={"right"}
                    >
                        <TextField
                            id="outlined-multiline-static"
                            // label=""
                            multiline
                            fullWidth
                            rows={10}
                            InputProps={{readOnly: true}}
                            defaultValue={props.comment ? props.comment : "No comment"}
                        />
                    </TutorialTip>
                </PlayerInfoItem>
            ) : null}
        </Stack>

    )
}

export default PlayerInformation;