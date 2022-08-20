import React from 'react';

import {Meta, Story} from '@storybook/react';

import LinkMarker from '.';
import { colorClasses } from './LinkMarker';


type LinkMarkerProps = React.ComponentProps<typeof LinkMarker>;


export default {
    title: 'Network/LinkMarker',
    component: LinkMarker,
    argTypes: {
        colorClass: {control: { type: "select", options: colorClasses},
        }
    }
} as Meta<LinkMarkerProps>;

const Template: Story<LinkMarkerProps & { colorClass: string } > = (args) => {
    return (
        <svg height={500} width={500}>
            <LinkMarker {...args}/>
            <path
                stroke="black"
                strokeWidth={args.linkWidth}
                d="M30,150 L100,50"
                markerEnd={`url(#marker-arrow-end-${args.networkId}-${args.colorClass})`}
            />
        </svg>
    )
};

export const FirstStory = Template.bind({});

FirstStory.args = {
    networkId: 'default',
    linkWidth: 3,
    linkCurvation: 2.5,
    nodeSize: 600 / 15,
    colorClass: 'large-negative',
};