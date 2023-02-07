import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import ErrorMessage from "./ErrorMessage";
import Header from "../../Header";

export default {
    title: 'Trials/ErrorMessage',
    component: ErrorMessage,
} as ComponentMeta<typeof ErrorMessage>;

const Template: ComponentStory<typeof ErrorMessage> = function (args) {
    return (
        <>
            <ErrorMessage {...args}/>
        </>
    );
};

export const UnknownError = Template.bind({});

UnknownError.args = {
};

export const ErrorWithKnownMessage = Template.bind({});

ErrorWithKnownMessage.args = {
    message: "No available sessions"
};