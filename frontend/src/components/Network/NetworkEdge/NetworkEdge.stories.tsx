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
                Size={args.nodeSize}
                x={args.target.x}
                y={args.target.y}
                Text={'A'}
                nodeInx={0}
                onNodeClick={() => {}}
                isActive={true}
                isValidMove={false}
            />
            <NetworkEdge {...args}/>
        </svg>
    )
};

export const DefaultEdge = Template.bind({});

DefaultEdge.args = {
    reward: -120,
    source: {x: 100, y: 100},
    target: {x: 500, y: 500},
    edgeWidth: 1,
    actionIdx: 0,
    edgeStyle: 'dashed',
    nodeSize: 10,
    edgeCurvation: 1
};

export const ReverseDirectionEdge = Template.bind({});

ReverseDirectionEdge.args = {
    reward: -120,
    source: {x: 500, y: 100},
    target: {x: 100, y: 500},
    edgeWidth: 1,
    actionIdx: 0,
    edgeStyle: 'dashed',
    nodeSize: 10,
    edgeCurvation: 1
};

