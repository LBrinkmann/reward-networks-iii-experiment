import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';


import TutorialTip from './TutorialTip';


export default {
    title: 'Experiment/TutorialTip',
    component: TutorialTip,
    argTypes: {
        tutorialIdx: {
            control: {type: "select", options: [0, 1, 2, 3]},
        },
        idx: {
            control: {type: "select", options: [0, 1, 2, 3]},
        },
        placement: {
            control: {type: "select", options: ["top", "right", "bottom", "left"]},
        },

    },
} as ComponentMeta<typeof TutorialTip>;

const Template: ComponentStory<typeof TutorialTip> = (args) =>
    <TutorialTip {...args}>
        <h1> Test Tutorial </h1>
    </TutorialTip>;

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    idx: 0,
    tutorialIdx: 0,
    arrow: true
};
