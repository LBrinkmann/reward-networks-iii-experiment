import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid, Typography} from "@mui/material";


interface SocialLearningSelectionProps {
    advisors: { advisorId: string, averageScore: number }[];
    onClickHandler: (advisorId: string, inx: number) => void;
    /** show tutorial tip */
    showTutorial?: boolean;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props: SocialLearningSelectionProps) => {
    const {showTutorial = false} = props;

    const [tutorialInx, setTutorialInx] = React.useState(1);

    const onTutorialClose = () => {
        setTutorialInx(tutorialInx + 1);
    }

    const renderOneCard = (advisor: { advisorId: string, averageScore: number }, inx: number) => {
        const onClickHandler = () => {
            props.onClickHandler(advisor.advisorId, inx + 1);
        }
        return (
                <Grid item key={inx}>
                    <SelectionOneCard
                        personInx={inx + 1}
                        averageScore={advisor.averageScore}
                        onClickHandler={onClickHandler}
                        showTutorial={showTutorial && inx === 1}
                        onTutorialClose={onTutorialClose}
                        disabled={showTutorial && tutorialInx === 1}
                    />
                </Grid>
        )
    }

    return (
        <>
            <Typography variant="h3" align='center'>
                Select a player to learn from
            </Typography>
            <Grid sx={{flexGrow: 1}} container spacing={8} justifyContent="center">
                {props.advisors.map((advisor, inx) => {
                    return renderOneCard(advisor, inx);
                })}
            </ Grid>
        </>
    );
};


export default Selection;