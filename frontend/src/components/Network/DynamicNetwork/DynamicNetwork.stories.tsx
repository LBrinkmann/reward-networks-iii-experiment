import React from 'react';

import NetworkWrapper from "../examples";

import {ComponentStory, ComponentMeta} from '@storybook/react';

import DynamicNetwork from './DynamicNetwork';

export default {
    title: 'Network/DynamicNetwork',
    component: DynamicNetwork,
} as ComponentMeta<typeof DynamicNetwork>;

const Template: ComponentStory<typeof DynamicNetwork> = (args) => {
    return (
        <NetworkWrapper child={<DynamicNetwork {...args}/>} />

    );

};

export const TenNodes = Template.bind({});

TenNodes.args = {

};