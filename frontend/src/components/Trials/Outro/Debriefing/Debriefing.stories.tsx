import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Debriefing from './Debriefing';

export default {
    title: 'Trials/Debriefing',
    component: Debriefing,
} as ComponentMeta<typeof Debriefing>;

const Template: ComponentStory<typeof Debriefing> = function (args) {
    return <Debriefing {...args}/>
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    redirect: "https://www.prolific.co/"
};