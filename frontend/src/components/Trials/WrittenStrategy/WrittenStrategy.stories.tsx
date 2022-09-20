import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import WrittenStrategy from "./WrittenStrategy";
import Header from "../../Header";

export default {
    title: 'Trials/WrittenStrategy',
    component: WrittenStrategy,
} as ComponentMeta<typeof WrittenStrategy>;

const Template: ComponentStory<typeof WrittenStrategy> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Written Strategy"}/>
            <WrittenStrategy {...args}/>
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    onClickContinue: null
};