import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid} from "@mui/material";


interface SocialLearningSelectionProps {
    advisors: { advisorInx: number, averageScore: number }[];
    onClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props: SocialLearningSelectionProps) => {
    return (
        <Grid sx={{flexGrow: 1}} container spacing={8} justifyContent="center">
            {props.advisors.map((advisor, inx) => {
                return (
                    <Grid item key={inx}>
                        <SelectionOneCard
                            personInx={advisor.advisorInx}
                            averageScore={advisor.averageScore}
                            onClickHandler={props.onClickHandler}/>
                    </Grid>
                )
            })}
        </ Grid>
    );
};


export default Selection;