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
                Radius={10}
                x={1 * 150 + 300}
                y={1.4702742047251475e-8 * -150 + 300}
                Text={'0'}
                nodeInx={0}
                onNodeClick={() => {}}
                isActive={true}
                isValidMove={false}
            />
            <NetworkNode
                Radius={10}
                x={0.30901697689880736 * 150 + 300}
                y={0.9510565490463628 * -150 + 300}
                Text={'2'}
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
    edgeWidth: 1,
    actionIdx: 0,
    edgeStyle: 'dashed',
    edgeCurvation: 1,
    source_x: 0.9531707596267098 * 150 + 300,
    source_y: 0.06445493409494168 * -150 + 300,
    arc_x: 0.4755241688835527 * 150 + 300,
    arc_y: 0.4755241688835527 * -150 + 300,
    target_x: 0.3581937405928582 * 150 + 300,
    target_y: 0.8833705410179864 * -150 + 300,
};

