import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import PlayerInformation from "./PlayerInformation";
import {Grid} from "@mui/material";


export default {
    title: 'Trials/PlayerInformation',
    component: PlayerInformation,
} as ComponentMeta<typeof PlayerInformation>;

const Template: ComponentStory<typeof PlayerInformation> = function (args) {

    return (
        <Grid container sx={{margin: 'auto', width: '85%'}} justifyContent="space-around">
            <Grid item sx={{p: 1}} xs={3}>
                <Grid container direction="column">
                    <Grid item xs={4}>
                        <></>
                    </Grid>
                    <Grid item xs={8}>
                        <PlayerInformation {...args}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <></>
            </Grid>
        </Grid>
    )
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    id: 1,
    step: 2,
    cumulativePoints: 100,
    totalScore: 2000,
    comment: "This is a comment",
    showComment: true,
};

export const NoComment = Template.bind({});

NoComment.args = {
    id: 1,
    step: 2,
    cumulativePoints: 100,
    totalScore: 2000,
    showComment: false,
};


