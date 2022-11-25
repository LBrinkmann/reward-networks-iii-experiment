import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import TaskExplorer from "./TaskExplorer";

import data from "../../Network/examples";

export default {
    title: 'Utils/TaskExplorer',
    component: TaskExplorer,
} as ComponentMeta<typeof TaskExplorer>;

const Template: ComponentStory<typeof TaskExplorer> = function (args) {
    return (
        <>
            <TaskExplorer {...args}/>
        </>
    );
};

export const Default = Template.bind({});

Default.args = {
    timer: 25,
    edges: data[0].edges,
    nodes: data[0].nodes,
    onNextTrialHandler: () => {location.reload()},
    hideTrial: false
};
