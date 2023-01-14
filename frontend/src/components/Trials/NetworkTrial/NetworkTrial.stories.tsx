import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import NetworkTrial from "./NetworkTrial";

import data from "../../Network/examples";
import NetworkContextProvider from "../../../contexts/NetworkContext";

const examples_rand = Array.from({length: data.length}, (v, k) => k + 1).sort(() => Math.random() - 0.5);

export default {
    title: 'Trials/NetworkTrial',
    component: NetworkTrial,
    decorators: [
        (ComponentStory) => {
            return (
                <NetworkContextProvider>
                    <ComponentStory/>
                </NetworkContextProvider>
            );
        },
    ]
} as ComponentMeta<typeof NetworkTrial>;

const Template: ComponentStory<typeof NetworkTrial> = function (args) {

    return (

        <NetworkTrial  {...args}/>

    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes,
};