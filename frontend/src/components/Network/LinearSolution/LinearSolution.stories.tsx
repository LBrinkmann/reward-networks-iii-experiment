import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import LinearSolution from './LinearSolution';
import {Paper} from "@mui/material";

import data from '../../Network/examples';

export default {
    title: 'Network/LinearSolution',
    component: LinearSolution,
} as ComponentMeta<typeof LinearSolution>;

const Template: ComponentStory<typeof LinearSolution> = (args) => {
    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 650,
                flexGrow: 1
            }}
        >
            <LinearSolution {...args}/>
        </Paper>
    )
};

export const EightSteps = Template.bind({});

EightSteps.args = {
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9],
    size: {width: 600, height: 100},
    nodeRadius: 20,
    gap: 60,
    onset: 60
};


export const FourSteps = Template.bind({});

FourSteps.args = {
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4],
    size: {width: 600, height: 100},
    nodeRadius: 20,
    gap: 60,
    onset: 60
};