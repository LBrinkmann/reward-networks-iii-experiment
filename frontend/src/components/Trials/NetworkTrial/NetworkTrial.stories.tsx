import React, {useEffect} from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';

import NetworkTrial from "./NetworkTrial";

import data from "../../Network/examples";
import useNetworkContext, {NetworkContextProvider} from "../../../contexts/NetworkContext";

const examples_rand = Array.from({length: data.length}, (v, k) => k + 1).sort(() => Math.random() - 0.5);

export default {
    title: 'Trials/NetworkTrial',
    component: NetworkTrial,
    decorators: [
        (ComponentStory) => {
            return (
                <NetworkContextProvider>
                    <ComponentStory/>
                </NetworkContextProvider>
            );
        },
    ]
} as ComponentMeta<typeof NetworkTrial>;

const Template: ComponentStory<typeof NetworkTrial> = function (args) {
    const [counter, setCounter] = React.useState(0);
    const {networkState, networkDispatcher} = useNetworkContext();

    useEffect(() => {
        if (!networkState.network) {
            networkDispatcher({
                type: 'setNetwork',
                payload: {
                    network: {
                        edges: data[examples_rand[counter]].edges,
                        nodes: data[examples_rand[counter]].nodes
                    }
                }
            });
        }

    }, []);

    const OnClick = () => {
        networkDispatcher({
            type: 'setNetwork',
            payload: {network: {edges: data[examples_rand[counter]].edges, nodes: data[examples_rand[counter]].nodes}}
        });
        setCounter(counter + 1);
    };


    return (
        <>
            {networkState.network && <NetworkTrial  {...args}/>}
            <button onClick={OnClick}>Next Network</button>
        </>


    );
};

export const ExampleOne = Template.bind({});

ExampleOne.args = {
    edges: data[examples_rand[0]].edges,
    nodes: data[examples_rand[0]].nodes,
};