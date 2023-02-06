import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Selection from './Selection';
import Header from "../../Header";

export default {
    title: 'Trials/Selection',
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
    advisors: {
        scores: [120, -500, -60, 800, -1000],
        advisor_ids: ["id_1", "id_2", "id_3", "id_4", "id_5"]
    },
};

export const Tutorial = Template.bind({});

Tutorial.args = {
    advisors: {
        scores: [120, -500, -60, 800, -1000],
        advisor_ids: ["id_1", "id_2", "id_3", "id_4", "id_5"]
    },
    showTutorial: true,
};