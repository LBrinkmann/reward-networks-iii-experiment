import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import WaitForNextTrialScreen from "./WaitForNextTrialScreen";
import Header from "../../Header";

export default {
    title: 'Trials/WaitForNextTrialScreen',
    component: WaitForNextTrialScreen,
} as ComponentMeta<typeof WaitForNextTrialScreen>;

const Template: ComponentStory<typeof WaitForNextTrialScreen> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Wait for the next trial"}/>
            <WaitForNextTrialScreen />
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
};