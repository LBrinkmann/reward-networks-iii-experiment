import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import ObservationTrial from './ObservationTrial';

import data from '../../../Network/examples';
import Header from "../../../Header";

export default {
    title: 'Trials/SocialLearning/Observation',
    component: ObservationTrial,
} as ComponentMeta<typeof ObservationTrial>;

const Template: ComponentStory<typeof ObservationTrial> = (args) => {
    return (
        <>
            <Header totalPoints={0} title={"Learning 1"}/>
            <ObservationTrial {...args}/>
        </>
    )
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    edges: data[0].edges,
    nodes: data[0].nodes,
    moves: [0, 5, 3, 4, 0, 5, 6, 7, 9]
};