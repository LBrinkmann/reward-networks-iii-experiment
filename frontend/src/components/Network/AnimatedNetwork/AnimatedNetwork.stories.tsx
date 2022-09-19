import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import AnimatedNetwork from './AnimatedNetwork';
import {Paper} from "@mui/material";

import data from '../../Network/examples';

export default {
    title: 'Network/AnimatedNetwork',
    component: AnimatedNetwork,
} as ComponentMeta<typeof AnimatedNetwork>;

const Template: ComponentStory<typeof AnimatedNetwork> = (args) => {
    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 550,
                flexGrow: 1
            }}
        >
            <AnimatedNetwork {...args}/>
        </Paper>
    )
};

export const TenNodes = Template.bind({});

TenNodes.args = {
    edges:  data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4, 0, 5]
};