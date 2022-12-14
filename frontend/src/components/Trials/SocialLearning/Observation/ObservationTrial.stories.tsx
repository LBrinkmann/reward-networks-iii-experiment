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
    moves: [0, 1, 4, 0, 6, 7, 9, 8, 9],
    onNextTrialHandler: () => {location.reload()},
};

export const NoComment = Template.bind({});

NoComment.args = {
    teacherId: 1,
    comment: "",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 1, 4, 0, 6, 7, 9, 8, 9],
    onNextTrialHandler: () => {location.reload()},
};


export const LongComment = Template.bind({});

LongComment.args = {
    teacherId: 1,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 1, 4, 0, 6, 7, 9, 8, 9],
    onNextTrialHandler: () => {location.reload()},
};


export const TrialWithInstructions = Template.bind({});

TrialWithInstructions.args = {
    teacherId: 1,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a",
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 1, 4, 0, 6, 7, 9, 8, 9],
    showTutorial: true,
    onNextTrialHandler: () => {location.reload()},
};