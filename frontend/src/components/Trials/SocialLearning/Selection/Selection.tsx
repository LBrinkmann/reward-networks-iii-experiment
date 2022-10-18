import React from "react";
import SelectionOneCard from "./SelectionOneCard";
import {Grid} from "@mui/material";


interface SocialLearningSelectionProps {
    advisors: { advisorId: string, averageScore: number }[];
    onClickHandler: (advisorId: string, inx: number) => void;
    isTutorial?: boolean;
}

const Selection: React.FC<SocialLearningSelectionProps> = (props: SocialLearningSelectionProps) => {
    const {isTutorial = false} = props;

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
                        isTutorial={isTutorial && inx === 2}
                    />
                </Grid>
        )
    }

    return (
        <>
            <Grid sx={{flexGrow: 1}} container spacing={8} justifyContent="center">
                {props.advisors.map((advisor, inx) => {
                    return renderOneCard(advisor, inx);
                })}
            </ Grid>
        </>
    );
};


export default Selection;