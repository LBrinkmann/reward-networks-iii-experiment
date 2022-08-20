import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import LinkMarker from '.';
import {animated} from 'react-spring';

export default {
    title: 'Network/LinkMarker',
    component: LinkMarker,
} as ComponentMeta<typeof LinkMarker>;

const Template: ComponentStory<typeof LinkMarker> = (args) => {
    return (
        <svg height={500} width={500}>
            <LinkMarker {...args} nodeSize={600 / 15} linkCurvation={2.5}/>
            <animated.path markerEnd={`url(#marker-arrow-end-default-positive`}
                           markerStart={`url(#marker-arrow-start-default-positive`}
                           markerUnits="userSpaceOnUse"/>
        </svg>
    )
};

export const FirstStory = Template.bind({});

FirstStory.args = {
    networkId: 'default',
    colorClass: 'positive',

};