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
    actions: [
        {
            "annotation": "-20",
            "source": {"nodeIdx": 0, "displayName": "A", "x": 0.7, "y": 0.2},
            "target": {"nodeIdx": 1, "displayName": "B", "x": 0.3, "y": 0.2},
            "colorClass": "large-negative",
            "linkStyle": "dashed"
        },
        {
            "annotation": "120",
            "source": {"nodeIdx": 5, "displayName": "F", "x": 0.9, "y": 0.5},
            "target": {"nodeIdx": 2, "displayName": "C", "x": 0.1, "y": 0.5},
            "colorClass": "positive",
            "linkStyle": "animated"
        },

    ],
    nodes: [
        {"nodeIdx": 0, "displayName": "A", "x": 0.7, "y": 0.2, status: 'active'},
        {"nodeIdx": 1, "displayName": "B", "x": 0.3, "y": 0.2, status: 'disabled'},
        {"nodeIdx": 5, "displayName": "F", "x": 0.9, "y": 0.5},
        {"nodeIdx": 2, "displayName": "C", "x": 0.1, "y": 0.5},
        {"nodeIdx": 4, "displayName": "E", "x": 0.7, "y": 0.8},
        {"nodeIdx": 3, "displayName": "D", "x": 0.3, "y": 0.8}
    ],


};