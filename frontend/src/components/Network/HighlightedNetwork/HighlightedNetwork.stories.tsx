import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import HighlightedNetwork from './HighlightedNetwork';
import {Paper} from "@mui/material";

import data from '../../Network/examples';

export default {
    title: 'Network/HighlightedNetwork',
    component: HighlightedNetwork,
} as ComponentMeta<typeof HighlightedNetwork>;

const Template: ComponentStory<typeof HighlightedNetwork> = (args) => {
    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 550,
                flexGrow: 1
            }}
        >
            <HighlightedNetwork {...args}/>
        </Paper>
    )
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9],
    edges:  data[0].edges,
    nodes: data[0].nodes,
    onNextStepHandler: (currentNode: number, nextNode: number) => {
        if (nextNode === 9) {
            window.localStorage.clear();
            location.reload();
        }
    },

};