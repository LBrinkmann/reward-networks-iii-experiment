import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid, Typography} from "@mui/material";
import {AdvisorSelection} from "../../../apis/apiTypes";


interface SocialLearningSelectionProps {
    advisors: AdvisorSelection;
    onAdvisorSelected: (advisorId: string, inx: number) => void;
    /** show tutorial tip */
    showTutorial?: boolean;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props) => {
    const {advisors, onAdvisorSelected, showTutorial = false} = props;


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
                    advisors.scores.map((score, inx) => {
                        return (
                            <Grid item key={inx}>
                                <SelectionOneCard
                                    personInx={inx + 1}
                                    averageScore={score}
                                    onClickHandler={() => onAdvisorSelected(advisors.advisor_ids[inx], inx + 1)}
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