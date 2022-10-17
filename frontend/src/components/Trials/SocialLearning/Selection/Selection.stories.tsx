import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Selection from './Selection';
import Header from "../../../Header";

export default {
    title: 'Trials/SocialLearning/Selection',
    component: Selection,
} as ComponentMeta<typeof Selection>;

const Template: ComponentStory<typeof Selection> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Selection"}/>
            <Selection {...args}/>
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    advisors: [
        {advisorInx: 1, averageScore: 120},
        {advisorInx: 2, averageScore: -500},
        {advisorInx: 3, averageScore: -60},
        {advisorInx: 4, averageScore: 800},
        {advisorInx: 5, averageScore: -1000},
    ],
};