import React from "react";
import {Card, CardActions, CardContent, Button, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import TutorialTip from "../../../Tutorial/TutorialTip";


interface SocialLearningSelectionOneCardProps {
    personInx: number;
    averageScore: number;
    onClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isTutorial?: boolean;
}

const SelectionOneCard: React.FC<SocialLearningSelectionOneCardProps> = (props) => {
    const {isTutorial = false} = props;
    return (
        <TutorialTip
            tutorialId={"social_learning_selection_player"}
            isTutorial={isTutorial}  // only show tutorial for the third player
            isShowTip={true}
        >
            <Card sx={{width: 230, alignItems: 'center', justifyContent: 'center'}}>
                <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <PersonIcon sx={{height: 120, width: 120}} color="action"/>
                    <Typography gutterBottom variant="h5" component="div">
                        Player {props.personInx}
                    </Typography>
                    <Typography variant="h6">
                        Average Score: {props.averageScore}
                    </Typography>
                </CardContent>
                <CardActions sx={{justifyContent: 'center'}}>
                    <Button variant="contained" color="primary" onClick={props.onClickHandler}>
                        Select
                    </Button>
                </CardActions>
            </Card>
        </TutorialTip>
    );
};


export default SelectionOneCard;