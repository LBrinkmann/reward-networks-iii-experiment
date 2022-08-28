import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Header from './Header';

export default {
    title: 'UI/Header',
    component: Header,
    argTypes: {
        tutorialIdx: {control: { type: "select", options: [0, 1]},
        }
    },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args}/>;

export const HeaderInExperiment = Template.bind({});

HeaderInExperiment.args = {
    totalPoints: 100
};

export const HeaderInTutorial = Template.bind({});

HeaderInTutorial.args = {
    totalPoints: 100,
    tutorialIdx: 0
};