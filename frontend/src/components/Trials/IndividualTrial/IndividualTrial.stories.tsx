import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import IndividualTrial from "./IndividualTrial";
import Header from "../../Header";

const data = require('../../Network/examples/train.json');

data.forEach((d: any) => {
    d.nodes.forEach((n: any, inx: number) => {
        n.x = (Math.cos(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
        n.y = (Math.sin(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
        if (inx === 0) {
            n.is_starting = true;
        }
    });
});

export default {
    title: 'Trials/IndividualTrial',
    component: IndividualTrial,
} as ComponentMeta<typeof IndividualTrial>;

const Template: ComponentStory<typeof IndividualTrial> = function (args) {
    return (
        <>
            <Header totalPoints={0} title={"Individual Trial"}/>
            <IndividualTrial {...args}/>
        </>
    );
};

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    edges: data[0].edges,
    nodes: data[0].nodes
};