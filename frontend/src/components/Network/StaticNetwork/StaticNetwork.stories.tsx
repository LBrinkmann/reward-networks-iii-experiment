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
        {
            "node_num": 0,
            "display_name": "A",
            "x": (Math.cos(36 * 1 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 1 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'active'
        },
        {
            "node_num": 1,
            "display_name": "B",
            "x": (Math.cos(36 * 2 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 2 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 2,
            "display_name": "C",
            "x": (Math.cos(36 * 3 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 3 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 3,
            "display_name": "D",
            "x": (Math.cos(36 * 4 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 4 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 4,
            "display_name": "E",
            "x": (Math.cos(36 * 5 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 5 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 5,
            "display_name": "F",
            "x": (Math.cos(36 * 6 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 6 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 6,
            "display_name": "G",
            "x": (Math.cos(36 * 7 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 7 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 7,
            "display_name": "H",
            "x": (Math.cos(36 * 8 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 8 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 8,
            "display_name": "I",
            "x": (Math.cos(36 * 9 * (Math.PI / 180)) + 1) / 3 + 0.1,
            "y": (Math.sin(36 * 9 * (Math.PI / 180)) + 1) / 3 + 0.1,
            status: 'disabled'
        },
        {
            "node_num": 9,
            "display_name": "J",
            "x": (Math.cos(36 * 0 * (Math.PI / 180)) + 1)  / 3 + 0.1,
            "y": (Math.sin(36 * 0 * (Math.PI / 180)) + 1)  / 3 + 0.1,
            status: 'disabled'
        },

    ],
    size: {width: 550, height: 550},
    nodeSize: 20,
    linkWidth: 2


};