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
            <path
                stroke="black"
                strokeWidth={args.linkWidth}
                d="M30,150 L100,50"
                markerEnd={`url(#${args.markerId}-${args.name})`}
            />

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