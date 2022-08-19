import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Network from './Network';

export default {
    title: 'Network',
    component: Network,
} as ComponentMeta<typeof Network>;

const Template: ComponentStory<typeof Network> = (args) => <Network {...args}/>;

export const FirstStory = Template.bind({});

FirstStory.args = {
    actions: [
        {
            "annotation": "-20",
            "source": {"nodeIdx": 0, "displayName": "A", "x": 0.7, "y": 0.2},
            "target": {"nodeIdx": 1, "displayName": "B", "x": 0.3, "y": 0.2},
            // "colorClass": "large-negative",
            "rewardId": 1
        },
        {"annotation": "20", "source": 0, "target": 5, "rewardId": 2},
        {"annotation": "140", "source": 1, "target": 0, "rewardId": 3},
        {"annotation": "-100", "source": 1, "target": 5, "rewardId": 0},
        {"annotation": "140", "source": 5, "target": 4, "rewardId": 3},
        {"annotation": "-100", "source": 5, "target": 1, "rewardId": 0},
        {"annotation": "-20", "source": 2, "target": 4, "rewardId": 1},
        {"annotation": "-100", "source": 2, "target": 3, "rewardId": 0},
        {"annotation": "-20", "source": 4, "target": 2, "rewardId": 1},
        {"annotation": "20", "source": 4, "target": 1, "rewardId": 2},
        {"annotation": "20", "source": 3, "target": 0, "rewardId": 2},
        {"annotation": "140", "source": 3, "target": 4, "rewardId": 3}
    ],
    nodes: [
        {"nodeIdx": 0, "displayName": "A", "x": 0.7, "y": 0.2},
        {"nodeIdx": 1, "displayName": "B", "x": 0.3, "y": 0.2},
        {"nodeIdx": 5, "displayName": "F", "x": 0.9, "y": 0.5},
        {"nodeIdx": 2, "displayName": "C", "x": 0.1, "y": 0.5},
        {"nodeIdx": 4, "displayName": "E", "x": 0.7, "y": 0.8},
        {"nodeIdx": 3, "displayName": "D", "x": 0.3, "y": 0.8}
    ],


};