import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import TutorialTip from './TutorialTip';


export default {
    title: 'Tutorial/TutorialTip',
    component: TutorialTip,
} as ComponentMeta<typeof TutorialTip>;

const Template: ComponentStory<typeof TutorialTip> = (args) =>
    <TutorialTip {...args}>
        <h1 style={{backgroundColor: 'seagreen'}}> Hover over me! </h1>
    </TutorialTip>;

export const Tutorial = Template.bind({});

Tutorial.args = {
    tutorialId: "social_learning_selection_player",
    isTutorial: true,
    isShowTip: false
};

export const Tip = Template.bind({});

Tip.args = {
    tutorialId: "social_learning_selection_player",
    isTutorial: false,
    isShowTip: true
};

