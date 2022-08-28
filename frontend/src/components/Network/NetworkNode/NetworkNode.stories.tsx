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
    node_num: 0,
    display_name: 'A',
    node_size: 100,
    x: 200,
    y: 200,
    status: 'active'

};