import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import ObservationTrial from './ObservationTrial';

import data from '../../../Network/examples';
import Header from "../../../Header";

export default {
    title: 'Trials/SocialLearning/Observation',
    component: ObservationTrial,
} as ComponentMeta<typeof ObservationTrial>;

const Template: ComponentStory<typeof ObservationTrial> = (args) => {
    return (
        <>
            <Header totalPoints={0} title={"Learning 1"}/>
            <ObservationTrial {...args}/>
        </>
    )
};

export const ShortComment = Template.bind({});

ShortComment.args = {
    teacherId: 1,
    comment: "Just follow the green arrows.",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9],
    onNextTrialHandler: () => {location.reload()},
};

export const NoComment = Template.bind({});

NoComment.args = {
    teacherId: 1,
    comment: "",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9],
    onNextTrialHandler: () => {location.reload()},
};


export const LongComment = Template.bind({});

LongComment.args = {
    teacherId: 1,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9],
    onNextTrialHandler: () => {location.reload()},
};