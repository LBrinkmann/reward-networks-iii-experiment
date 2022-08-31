import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import ConsentForm from './ConsentForm';
import Header from "../../../Header";

export default {
    title: 'Trials/ConsentForm',
    component: ConsentForm,
} as ComponentMeta<typeof ConsentForm>;

const Template: ComponentStory<typeof ConsentForm> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Consent"}/>
            <ConsentForm {...args}/>
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {};