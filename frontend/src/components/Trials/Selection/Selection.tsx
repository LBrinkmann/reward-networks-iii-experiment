import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid, Typography} from "@mui/material";


interface SocialLearningSelectionProps {
    advisors: { advisorId: string, averageScore: number }[];
    onClickHandler: (advisorId: string, inx: number) => void;
    /** show tutorial tip */
    showTutorial?: boolean;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props) => {
    const {advisors, onClickHandler, showTutorial = false} = props;


    const [tutorialInx, setTutorialInx] = React.useState(1);

    const onTutorialClose = () => {
        setTutorialInx(tutorialInx + 1);
    }

    return (
        <>
            <Typography variant="h3" align='center'>
                Select a player to learn from
            </Typography>
            <Grid sx={{flexGrow: 1}} container spacing={8} justifyContent="center">
                {
                    advisors.map((advisor, inx) => {
                        return (
                            <Grid item key={inx}>
                                <SelectionOneCard
                                    personInx={inx + 1}
                                    averageScore={advisor.averageScore}
                                    onClickHandler={() => onClickHandler(advisor.advisorId, inx + 1)}
                                    showTutorial={showTutorial && inx === 1}
                                    onTutorialClose={onTutorialClose}
                                    disabled={showTutorial && tutorialInx === 1}
                                />
                            </Grid>
                        )
                    })
                }
            </ Grid>
        </>
    );
};


export default Selection;