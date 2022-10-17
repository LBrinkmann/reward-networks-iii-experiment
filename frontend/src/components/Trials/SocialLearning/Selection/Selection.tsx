import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid} from "@mui/material";


interface SocialLearningSelectionProps {
    advisors: { advisorId: string, averageScore: number }[];
    onClickHandler: (advisorId: string, inx: number) => void;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props: SocialLearningSelectionProps) => {
    return (
        <Grid sx={{flexGrow: 1}} container spacing={8} justifyContent="center">
            {props.advisors.map((advisor, inx) => {
                const onClickHandler = () => {
                    props.onClickHandler(advisor.advisorId, inx);
                }
                return (
                    <Grid item key={inx}>
                        <SelectionOneCard
                            personInx={inx}
                            averageScore={advisor.averageScore}
                            onClickHandler={onClickHandler}/>
                    </Grid>
                )
            })}
        </ Grid>
    );
};


export default Selection;