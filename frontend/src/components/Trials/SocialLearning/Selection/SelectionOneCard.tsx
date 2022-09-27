import React from "react";
import {Box, Card, CardActions, CardContent, Button, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';


interface SocialLearningSelectionOneCardProps {
    personInx: number;
    averageScore: number;
    onClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const SelectionOneCard: React.FC<SocialLearningSelectionOneCardProps> = (props: SocialLearningSelectionOneCardProps) => {
    return (
        <Card sx={{maxWidth: 200, alignItems: 'center', justifyContent: 'center'}}>
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
    );
};


export default SelectionOneCard;