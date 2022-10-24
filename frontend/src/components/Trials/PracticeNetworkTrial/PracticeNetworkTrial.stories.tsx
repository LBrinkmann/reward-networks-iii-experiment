import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import PracticeNetworkTrial from "./PracticeNetworkTrial";

export default {
    title: 'Trials/PracticeNetworkTrial',
    component: PracticeNetworkTrial,
} as ComponentMeta<typeof PracticeNetworkTrial>;

const Template: ComponentStory<typeof PracticeNetworkTrial> = function (args) {
    return (
        <>
            <PracticeNetworkTrial {...args}/>
        </>
    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    timer: 30,
    onNextTrialHandler: () => {
        location.reload()
    },
    hideTrial: false
};
