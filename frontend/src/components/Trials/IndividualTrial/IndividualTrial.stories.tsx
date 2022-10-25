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
    const [totalPoints, setTotalPoints] = React.useState(0);

    const updateTotalPoints = (points: number) => {
        setTotalPoints(totalPoints + points);
    }

    return (
        <>
            <Header totalPoints={totalPoints} title={"Individual Trial"}/>
            <IndividualTrial updateTotalScore={updateTotalPoints} {...args}/>
        </>
    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    timer: 25,
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes,
    onNextTrialHandler: () => {location.reload()},
    hideTrial: false
};

export const ExampleTwo = Template.bind({});

ExampleTwo.args = {
    timer: 25,
    edges: data[examples_rand[1]].edges,
    nodes: data[examples_rand[1]].nodes,
    onNextTrialHandler: () => {location.reload()},
    hideTrial: false
};
