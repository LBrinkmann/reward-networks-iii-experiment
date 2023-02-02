import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Instruction from './Instruction';
import Header from "../../Header";

export default {
    title: 'Trials/Instruction',
    component: Instruction

} as ComponentMeta<typeof Instruction>;

const Template: ComponentStory<typeof Instruction> = function (args) {
    return (
        <>
            <Header title={"Instruction"} />
            <Instruction {...args}/>
        </>
    )
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    endTrial: ({moves: []}) => {},
    instructionText: "instruction text",
};