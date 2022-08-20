import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Marker from '.';

export default {
    title: 'Network/Marker',
    component: Marker,
} as ComponentMeta<typeof Marker>;

const Template: ComponentStory<typeof Marker> = (args) => {
    return (
        <svg height={500} width={500}>
            <Marker {...args}/>
            <line x1="10" y1="10" x2="100" y2="100"
                  style={{stroke:"red", "marker-end": "url(#marker-arrow-end-1-positive)"}}/>
        </svg>
    )
};

export const FirstStory = Template.bind({});

FirstStory.args = {
    orient: "auto",
    nodeSize: 600 / 15,
    linkWidth: 5,
    linkCurvation: 2.5,
    prefix: "marker-arrow-end-1",
    name: "positive",

};