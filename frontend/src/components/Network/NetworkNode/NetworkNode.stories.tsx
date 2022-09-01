import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import NetworkNode from './NetworkNode';


export default {
    title: 'Network/NetworkNode',
    component: NetworkNode,
    argTypes: {
        Text: {control: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']},
    }
} as ComponentMeta<typeof NetworkNode>;

const Template: ComponentStory<typeof NetworkNode> = (args) => {
    return (
        <svg height={500} width={500}>
            <NetworkNode {...args}/>
        </svg>
    )
};

export const ActiveNode = Template.bind({});

ActiveNode.args = {
    nodeInx: 0,
    Text: 'A',
    Size: 100,
    x: 200,
    y: 200,
    isActive: true
};

export const ValidClickNode = Template.bind({});

ValidClickNode.args = {
    nodeInx: 0,
    Text: 'A',
    Size: 100,
    x: 200,
    y: 200,
    isActive: false,
    isValidMove: true
};

export const InvalidClickNode = Template.bind({});

InvalidClickNode.args = {
    nodeInx: 0,
    Text: 'A',
    Size: 100,
    x: 200,
    y: 200,
    isActive: false,
    isValidMove: false
};
