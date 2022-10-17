import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import TryYourselfTrial from "./TryYourselfTrial";
import Header from "../../../Header";

import data from "../../../Network/examples";


export default {
    title: 'Trials/SocialLearning/TryYourself',
    component: TryYourselfTrial,
} as ComponentMeta<typeof TryYourselfTrial>;

const Template: ComponentStory<typeof TryYourselfTrial> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Learning 3"}/>
            <TryYourselfTrial {...args}/>
        </>
    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9],
    teacherId: 1,
    timer: 30,
    edges: data[0].edges,
    nodes: data[0].nodes,
    onNextTrialHandler: () => {location.reload()},
    hideTrial: false
};
