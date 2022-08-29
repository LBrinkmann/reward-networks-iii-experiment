import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import NetworkEdge from './NetworkEdge';
import NetworkNode from "../NetworkNode";


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
        <svg height={550} width={550}>
            <NetworkNode
                node_size={args.nodeSize}
                x={500}
                y={500}
                display_name={'A'}
                node_num={0}
                status={'active'}
                onNodeClick={() => {}}
            />
            <NetworkEdge {...args}/>
        </svg>
    )
};

export const SixNodesNet = Template.bind({});

SixNodesNet.args = {
    reward: -120,
    source: {x: 100, y: 100},
    target: {x: 500, y: 500},
    edgeWidth: 5,
    actionIdx: 0,
    edgeStyle: 'dashed',
    nodeSize: 40,
    edgeCurvation: 1,
};

export const TenNodesNet = Template.bind({});

TenNodesNet.args = {
    reward: -120,
    source: {x: 100, y: 100},
    target: {x: 500, y: 500},
    edgeWidth: 1,
    actionIdx: 0,
    edgeStyle: 'dashed',
    nodeSize: 10,
    edgeCurvation: 1
};
