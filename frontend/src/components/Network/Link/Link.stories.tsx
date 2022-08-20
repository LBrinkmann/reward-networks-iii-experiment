import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import Link from '.';


export default {
    title: 'Network/Link',
    component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => {
    return (
        <svg height={500} width={500}>
            <Link {...args}/>
        </svg>
    )
};

export const FirstStory = Template.bind({});

FirstStory.args = {
    annotation: '-20',
    actionIdx: 'number;',
    colorClass: 'negative',
    source: {"annotation": "20", "source": 0, "target": 5, "rewardId": 2},
    target: {"annotation": "140", "source": 1, "target": 0, "rewardId": 3},
    width: 1,
    networkId: '1234',
    linkStyle: 'dashed'
};