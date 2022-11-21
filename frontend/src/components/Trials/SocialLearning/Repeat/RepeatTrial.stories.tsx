import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import RepeatTrial from './RepeatTrial';

import data from '../../../Network/examples';
import Header from "../../../Header";

export default {
    title: 'Trials/SocialLearning/Repeat',
    component: RepeatTrial,
} as ComponentMeta<typeof RepeatTrial>;

const Template: ComponentStory<typeof RepeatTrial> = (args) => {
    return (
        <>
            <Header totalPoints={0} title={"Learning 2"}/>
            <RepeatTrial {...args}/>
        </>
    )
};

export const ShortComment = Template.bind({});

ShortComment.args = {
    teacherId: 1,
    comment: "Just follow the green arrows.",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 1, 4, 0, 6, 7, 9, 8, 9],
    onNextTrialHandler: () => {location.reload()},
};

