import React, {useEffect} from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';

import data from "../../Network/examples";
import useNetworkContext, {NetworkContextProvider} from "../../../contexts/NetworkContext";
import {edges, nodes} from "./PracticeData";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";
import Practice from "./Practice";

const examples_rand = Array.from({length: data.length}, (v, k) => k + 1).sort(() => Math.random() - 0.5);

export default {
    title: 'Trials/Practice',
    component: Practice,
    decorators: [
        (ComponentStory) => {
            return (
                <NetworkContextProvider saveToLocalStorage={false}>
                    <ComponentStory/>
                </NetworkContextProvider>
            );
        },
    ]
} as ComponentMeta<typeof Practice>;

const Template: ComponentStory<typeof Practice> = function (args) {
    const [counter, setCounter] = React.useState(0);
    const {networkState, networkDispatcher} = useNetworkContext();

    useEffect(() => {
        if (!networkState.network) {

            networkDispatcher({
                type: NETWORK_ACTIONS.SET_NETWORK,
                payload: {network: {edges: edges, nodes: nodes}, isPractice: true}
            });
        }

    }, []);


    return (
        <>
            {networkState.network && <Practice/>}
        </>
    );
};


export const PracticeTrial = Template.bind({});

PracticeTrial.args = {};
