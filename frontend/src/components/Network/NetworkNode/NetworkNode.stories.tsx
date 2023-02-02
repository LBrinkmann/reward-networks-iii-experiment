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
    Radius: 100,
    x: 200,
    y: 200,
    status: 'active',
};

export const StartingNode = Template.bind({});

StartingNode.args = {
    nodeInx: 0,
    Text: 'A',
    Radius: 100,
    x: 200,
    y: 200,
    status: 'starting',
};

export const DisabledNode = Template.bind({});

DisabledNode.args = {
    nodeInx: 0,
    Text: 'A',
    Radius: 100,
    x: 200,
    y: 200,
    status: 'disabled',
};

export const ValidClickNode = Template.bind({});

ValidClickNode.args = {
    nodeInx: 0,
    Text: 'B',
    Radius: 100,
    x: 200,
    y: 200,
    status: 'normal',
    isValidMove: true
};

export const InvalidClickNode = Template.bind({});

InvalidClickNode.args = {
    nodeInx: 0,
    Text: 'C',
    Radius: 100,
    x: 200,
    y: 200,
    status: 'normal',
    isValidMove: false
};
