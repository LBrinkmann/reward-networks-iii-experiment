import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import NetworkNode from './NetworkNode';


export default {
    title: 'Network/NetworkNode',
    component: NetworkNode,
} as ComponentMeta<typeof NetworkNode>;

const Template: ComponentStory<typeof NetworkNode> = (args) => {
    return (
        <svg height={500} width={500}>
            <NetworkNode {...args}/>
        </svg>
    )
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    nodeIdx: 0,
    displayName: 'A',
    x: 200,
    y: 200,
    actionIdx: [0],
    nodeSize: 100,
    networkId: '1234',
    status: 'active'

};