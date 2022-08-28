import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import StaticNetwork from './StaticNetwork';

export default {
    title: 'Network/StaticNetwork',
    component: StaticNetwork,
} as ComponentMeta<typeof StaticNetwork>;

const Template: ComponentStory<typeof StaticNetwork> = (args) => <StaticNetwork {...args}/>;

export const FirstStory = Template.bind({});

FirstStory.args = {
    edges: [
        {source_num: 0, target_num: 1, reward: -120},
        {source_num: 2, target_num: 3, reward: 20},
        {source_num: 3, target_num: 5, reward: -20},
        {source_num: 4, target_num: 3, reward: 120},
        {source_num: 5, target_num: 0, reward: 120},
    ],
    nodes: [
        {"node_num": 0, "display_name": "A", "x": 0.7, "y": 0.2, status: 'active'},
        {"node_num": 1, "display_name": "B", "x": 0.3, "y": 0.2, status: 'disabled'},
        {"node_num": 5, "display_name": "F", "x": 0.9, "y": 0.5, status: 'disabled'},
        {"node_num": 2, "display_name": "C", "x": 0.1, "y": 0.5, status: 'disabled'},
        {"node_num": 4, "display_name": "E", "x": 0.7, "y": 0.8, status: 'disabled'},
        {"node_num": 3, "display_name": "D", "x": 0.3, "y": 0.8, status: 'disabled'},
    ],


};