import React, {useEffect} from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';

import Observation from "./Observation";

import data from "../../Network/examples";
import useNetworkContext, {NetworkContextProvider} from "../../../contexts/NetworkContext";


export default {
    title: 'Trials/Observation',
    component: Observation,
    decorators: [
        (ComponentStory) => {
            return (
                <NetworkContextProvider saveToLocalStorage={false}>
                    <ComponentStory/>
                </NetworkContextProvider>
            );
        },
    ]
} as ComponentMeta<typeof Observation>;

const Template: ComponentStory<typeof Observation> = function (args) {
    const {networkState, networkDispatcher} = useNetworkContext();

    useEffect(() => {
        if (!networkState.network) {
            networkDispatcher({
                type: 'setNetwork',
                payload: {
                    network: {
                        edges: data[0].edges,
                        nodes: data[0].nodes
                    },
                    isPractice: false
                }
            });
        }

    }, []);


    return (
        <>
            {networkState.network &&
                <Observation{...args}/>}
        </>


    );
};

export const Default = Template.bind({});

Default.args = {
    solution: [9, 3, 8, 7, 4, 6, 7, 4, 6],
    teacherId: 1,
};
