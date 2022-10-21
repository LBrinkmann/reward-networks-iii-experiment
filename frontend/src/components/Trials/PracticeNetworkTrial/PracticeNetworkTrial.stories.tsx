import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import PracticeNetworkTrial from "./PracticeNetworkTrial";
import Header from "../../Header";

export default {
    title: 'Trials/PracticeNetworkTrial',
    component: PracticeNetworkTrial,
} as ComponentMeta<typeof PracticeNetworkTrial>;

const Template: ComponentStory<typeof PracticeNetworkTrial> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Practice Trial"}/>
            <PracticeNetworkTrial {...args}/>
        </>
    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    timer: 30,
    onNextTrialHandler: () => {location.reload()},
    hideTrial: false
};
