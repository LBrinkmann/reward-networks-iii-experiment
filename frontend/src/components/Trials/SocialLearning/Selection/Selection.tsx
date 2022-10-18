import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid} from "@mui/material";


interface SocialLearningSelectionProps {
    advisors: { advisorId: string, averageScore: number }[];
    onClickHandler: (advisorId: string, inx: number) => void;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props: SocialLearningSelectionProps) => {
    const renderOneCard = (advisor: { advisorId: string, averageScore: number }, inx: number) => {
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
    }

    return (
        <Grid sx={{flexGrow: 1}} container spacing={8} justifyContent="center">
            {props.advisors.map((advisor, inx) => {
                return renderOneCard(advisor, inx);
            })}
        </ Grid>
    );
};


export default Selection;