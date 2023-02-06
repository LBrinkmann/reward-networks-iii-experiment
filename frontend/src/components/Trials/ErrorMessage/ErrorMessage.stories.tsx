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

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    onClickContinue: null
};