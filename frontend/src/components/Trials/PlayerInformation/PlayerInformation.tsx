import {CardMedia, Divider, Paper, Stack, TextField, Typography} from "@mui/material";
import React, {FC} from "react";
import TutorialTip from "../../Tutorial/TutorialTip";
import rewardsImg from "../../../images/legend.png";
import styled from "@emotion/styled";

interface PlayerInformationProps {
    /** Player's ID */
    id: number;
    step: number;
    cumulativePoints: number;
    /** Player's comment */
    comment?: string;
    showComment?: boolean;
    /** show tutorial tip */
    showTutorialScore?: boolean;
    showTutorialComment?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
    /** Show the legend for the rewards */
    showLegend?: boolean;
}

const Item = styled(Paper)(() => ({
    padding: 2,
    elevation: 0,
    textAlign: 'left',
}));

const PlayerInfoItem: FC = ({children}) => {
    return (
        <Item elevation={0}>
            {children}
            <Divider/>
        </Item>
    )
};


export const PlayerInformation: FC<PlayerInformationProps> = (props) => {
    const {showComment = true, showTutorialScore = false, showTutorialComment = false, showLegend = true} = props;
    return (

        <Stack spacing={1} sx={{paddingTop: "20px"}}>
            <PlayerInfoItem>
                {/*show if showLegend*/}
                {showLegend && (
                    <CardMedia
                        component="img"
                        image={rewardsImg}
                        alt="You earn or lose points depending on the color of the arrow."
                    />
                )}
            </PlayerInfoItem>
            <PlayerInfoItem>
                <Typography gutterBottom variant="h5" component="div">
                    Step {props.step}
                </Typography>
            </PlayerInfoItem>
            <PlayerInfoItem>
                <TutorialTip
                    tutorialId={"practice_step_score"}
                    isTutorial={showTutorialScore}
                    isShowTip={false}
                    onTutorialClose={props.onTutorialClose}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        Points {props.cumulativePoints}
                    </Typography>
                </TutorialTip>
            </PlayerInfoItem>
            {(showComment) ? (
                <PlayerInfoItem>
                    <Typography gutterBottom variant="h5" component="div">
                        Player {props.id} comment:
                    </Typography>

                    <TutorialTip
                        tutorialId={"social_learning_observation_comment"}
                        isTutorial={showTutorialComment}
                        isShowTip={false}
                        onTutorialClose={props.onTutorialClose}
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