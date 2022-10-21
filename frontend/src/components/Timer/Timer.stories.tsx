import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Timer from './Timer';


export default {
    title: 'Utils/Timer',
    component: Timer,
} as ComponentMeta<typeof Timer>;

const Template: ComponentStory<typeof Timer> = function (args) {
    return (
        <>
            <Timer {...args}/>
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    pause: false,
    time: 30,
    OnTimeEndHandler: () => {location.reload()},
};