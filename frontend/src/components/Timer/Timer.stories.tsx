import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Timer from './Timer';
import {NetworkContextProvider} from "../../contexts/NetworkContext";


export default {
    title: 'Utils/Timer',
    component: Timer,
    decorators: [
        (ComponentStory) => {
            return (
                <NetworkContextProvider>
                    <ComponentStory/>
                </NetworkContextProvider>
            );
        },
    ]
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

export const Tutorial = Template.bind({});

Tutorial.args = {
    pause: true,
    time: 30,
    showTutorial: true,
    OnTimeEndHandler: () => {location.reload()},
};

export const invisible5seconds = Template.bind({});

invisible5seconds.args = {
    pause: false,
    time: 25,
    invisibleTime: 5,
};