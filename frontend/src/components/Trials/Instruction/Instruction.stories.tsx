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
            <Header title={"Instructions"} />
            <Instruction {...args}/>
        </>
    )
};

export const Welcome = Template.bind({});

Welcome.args = {
    endTrial: ({moves: []}) => {},
    instructionText: "Lorem ipsum",
    instructionType: "welcome",
};

export const Learning = Template.bind({});
Learning.args = {
    endTrial: ({moves: []}) => {},
    instructionType: "learning",
}