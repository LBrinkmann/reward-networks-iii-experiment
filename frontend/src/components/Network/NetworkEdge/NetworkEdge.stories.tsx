import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import NetworkEdge from './NetworkEdge';


export default {
    title: 'Network/NetworkEdge',
    component: NetworkEdge,
    argTypes: {
        reward: {
            control: { type: 'select', options: [-120, -20, 20, 120] },
        }
    }
} as ComponentMeta<typeof NetworkEdge>;

const Template: ComponentStory<typeof NetworkEdge> = (args) => {
    return (
        <svg height={500} width={500}>
            <NetworkEdge {...args}/>
        </svg>
    )
};

export const FirstStory = Template.bind({});

FirstStory.args = {
    reward: -120,
    source: {x: 100, y: 100},
    target: {x: 500, y: 500},
    width: 5,
    actionIdx: 0,
    networkId: '1234',
    linkStyle: 'dashed'
};