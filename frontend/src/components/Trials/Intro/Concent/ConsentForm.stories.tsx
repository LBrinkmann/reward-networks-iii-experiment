import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import ConsentForm from './ConsentForm';

export default {
    title: 'Trials/ConsentForm',
    component: ConsentForm,
} as ComponentMeta<typeof ConsentForm>;

const Template: ComponentStory<typeof ConsentForm> = function (args) {
    return (
        <>
            <ConsentForm {...args}/>
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
};