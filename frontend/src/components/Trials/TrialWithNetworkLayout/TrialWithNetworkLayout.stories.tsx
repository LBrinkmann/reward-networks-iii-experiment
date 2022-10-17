import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import TrialWithNetworkLayout from "./TrialWithNetworkLayout";
import PlayerInformation from "../SocialLearning/PlayerInformation";
import LinearSolution from "../../Network/LinearSolution";
import Timer from "../IndividualTrial/Timer";
import Header from "../../Header";

import data from "../../Network/examples";
import AnimatedNetwork from "../../Network/AnimatedNetwork";

export default {
    title: 'Trials/TrialWithNetworkLayout',
    component: TrialWithNetworkLayout,
} as ComponentMeta<typeof TrialWithNetworkLayout>;

const Template: ComponentStory<typeof TrialWithNetworkLayout> = function (args) {

    const timer = 500;
    const step = 5;
    const cumulativePoints = 120;
    const edges = data[0].edges;
    const nodes = data[0].nodes;
    const moves = [0, 5, 3, 4, 0, 5, 6, 7, 9];
    const teacherId = 2;
    const comment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const renderNetwork = () => (
        <AnimatedNetwork
            nodes={nodes}
            edges={edges}
            moves={moves}
            onNextStepHandler={() => {}}
            startAnimation={true}
        />
    )

    const renderPlayerInformation = () => (
        <PlayerInformation
            id={teacherId}
            step={step}
            cumulativePoints={cumulativePoints}
            comment={comment}
            showComment={true}
        />
    )

    const renderLinearSolution = () => (
        <LinearSolution
            nodes={nodes}
            edges={edges}
            moves={moves}
            title={"Player " + teacherId + " total score"}
        />
    )

    const renderTimer = () => <Timer time={timer} OnTimeEndHandler={() => {}}/>

    return (
        <>
            <Header totalPoints={0} title={"Layout"}/>
            <TrialWithNetworkLayout
                network={renderNetwork()}
                timer={renderTimer()}
                playerInformation={renderPlayerInformation()}
                linearSolution={renderLinearSolution()}
                {...args}
            />
        </>
    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    showLinearSolution: true,
    showPlayerInformation: true,
    showTimer: true
};

