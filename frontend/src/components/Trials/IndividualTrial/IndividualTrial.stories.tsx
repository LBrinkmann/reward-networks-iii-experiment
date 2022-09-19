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

export const tenSeconds = Template.bind({});

tenSeconds.args = {
    timer: 10,
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes
};

export const oneMinuteExampleOne = Template.bind({});

oneMinuteExampleOne.args = {
    timer: 60,
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes
};

export const oneMinuteExampleTwo = Template.bind({});

oneMinuteExampleTwo.args = {
    timer: 60,
    edges: data[examples_rand[1]].edges,
    nodes: data[examples_rand[1]].nodes
};

export const twoMinutesExampleOne = Template.bind({});

twoMinutesExampleOne.args = {
    timer: 2 * 60,
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes
};

export const twoMinutesExample2 = Template.bind({});

twoMinutesExample2.args = {
    timer: 2 * 60,
    edges: data[examples_rand[1]].edges,
    nodes: data[examples_rand[1]].nodes
};