import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Marker from './Marker';
import NetworkNode from "../NetworkNode";

export default {
    title: 'Network/Marker',
    component: Marker,
    argTypes: {
        orient: {
            control: {type: 'select', options: ["auto", "auto-start-reverse"]},
        },
        nodeSize: {
            control: {type: 'select', options: [10, 20, 30, 40, 50, 60]},
        },
        edgeWidth: {
            control: {type: 'select', options: [1, 2, 3, 4, 5]},
        }
    }
} as ComponentMeta<typeof Marker>;

const Template: ComponentStory<typeof Marker> = (args) => {
    return (
        <svg height={500} width={500}>
            <Marker {...args}/>
            <path
                stroke="black"
                strokeWidth={args.edgeWidth}
                d="M10,10 L300,300"
                markerEnd={`url(#${args.markerId})`}
            />
            <NetworkNode
                node_size={args.nodeSize}
                x={300}
                y={300}
                display_name={'A'}
                node_num={0}
                status={'active'}
                onNodeClick={() => {}}
            />

        </svg>
    )
};

export const Default = Template.bind({});

Default.args = {
    orient: "auto",
    markerId: 'marker-id',
    nodeSize: 10,
    edgeWidth: 1,
    linkCurvation: 2.5
};