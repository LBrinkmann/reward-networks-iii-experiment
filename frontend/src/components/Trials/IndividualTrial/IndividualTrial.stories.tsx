import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import IndividualTrial from "./IndividualTrial";
import Header from "../../Header";

import data from "../../Network/examples";

const examples_rand = Array.from({length: data.length}, (v, k) => k + 1).sort(() => Math.random() - 0.5);

export default {
    title: 'Trials/IndividualTrial',
    component: IndividualTrial,
} as ComponentMeta<typeof IndividualTrial>;

const Template: ComponentStory<typeof IndividualTrial> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Individual Trial"}/>
            <IndividualTrial {...args}/>
        </>
    );
};

export const halfMinuteExampleOne = Template.bind({});

halfMinuteExampleOne.args = {
    timer: 30,
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes,
    onNextTrialHandler: () => { },
    hideTrial: false
};

export const ExampleTwo = Template.bind({});

ExampleTwo.args = {
    timer: 30,
    edges: data[examples_rand[1]].edges,
    nodes: data[examples_rand[1]].nodes,
    onNextTrialHandler: () => { },
    hideTrial: false
};

export const ScreenAfterTrialEnd = Template.bind({});

ScreenAfterTrialEnd.args = {
    timer: 30,
    edges: data[examples_rand[1]].edges,
    nodes: data[examples_rand[1]].nodes,
    onNextTrialHandler: () => { },
    hideTrial: true
};