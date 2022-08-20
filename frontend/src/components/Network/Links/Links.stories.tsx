import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Links from '.';
import LinkMarker from "../LinkMarker";


export default {
    title: 'Network/Links',
    component: Links,
} as ComponentMeta<typeof Links>;

const Template: ComponentStory<typeof Links> = (args) => {
    return (
        <svg height={500} width={500}>
            <LinkMarker {...args} nodeSize={600 / 15} linkCurvation={2.5}/>
            <Links {...args}/>
        </svg>
    )
};

export const FirstStory = Template.bind({});

FirstStory.args = {
    actions: [
        {
            "annotation": "120",
            "source": {"nodeIdx": 5, "displayName": "F", "x": 0.9, "y": 0.5},
            "target": {"nodeIdx": 2, "displayName": "C", "x": 0.1, "y": 0.5},
            "colorClass": "positive",
            "linkStyle": "animated"
        }
    ],
    size: {width: 550, height: 550},
    linkWidth: 3,
};