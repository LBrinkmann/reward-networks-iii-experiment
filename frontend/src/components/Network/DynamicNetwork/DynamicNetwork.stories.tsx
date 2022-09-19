import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import DynamicNetwork from './DynamicNetwork';

import data from "../../Network/examples";

const examples_rand = Array.from({length: data.length}, (v, k) => k + 1).sort(() => Math.random() - 0.5);

export default {
    title: 'Network/DynamicNetwork',
    component: DynamicNetwork,
} as ComponentMeta<typeof DynamicNetwork>;

const Template: ComponentStory<typeof DynamicNetwork> = (args) => <DynamicNetwork {...args}/>;

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes,
};

export const ExampleTwo = Template.bind({});

ExampleTwo.args = {
    edges: data[examples_rand[1]].edges,
    nodes: data[examples_rand[1]].nodes,
};