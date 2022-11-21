import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';


import TutorialDialog from './TutorialDialog';


export default {
    title: 'Tutorial/TutorialDialog',
    component: TutorialDialog,

} as ComponentMeta<typeof TutorialDialog>;

const Template: ComponentStory<typeof TutorialDialog> = (args) => <TutorialDialog {...args}/>

export const DefaultStory = Template.bind({});

DefaultStory.args = {
    isOpen: true,
    title: "Test Title",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur consequat sem, a tempus eros tempor id. Ut nisl felis, faucibus eget lectus quis, consectetur sollicitudin leo. Sed euismod enim felis, faucibus pretium mi tempus nec. Aenean eget cursus est. Nam vel fermentum eros, eget congue nisl. Pellentesque ut tincidunt ex, ac bibendum risus. Phasellus nibh turpis, maximus blandit lorem eget, sagittis commodo ipsum. Proin accumsan dolor sapien, quis mollis massa cursus posuere. Nullam cursus eros massa, nec aliquam massa convallis ac. Curabitur fermentum pulvinar odio vel sagittis. Morbi at tempus eros. Aenean ullamcorper tortor at nisl facilisis iaculis. Etiam a nulla sit amet urna bibendum venenatis vel eget urna. Aenean laoreet faucibus purus, posuere dictum enim dapibus at."
};
