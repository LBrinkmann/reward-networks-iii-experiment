import React, {useEffect, useState} from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import TaskExplorer from "./TaskExplorer";

import default_data from "../../Network/examples";

export default {
    title: 'Utils/TaskExplorer2',
    component: TaskExplorer,
} as ComponentMeta<typeof TaskExplorer>;

const Template: ComponentStory<typeof TaskExplorer> = function (args) {
    const [edges, setEdges] = useState(args.edges);
    const [nodes, setNodes] = useState(args.nodes);

    useEffect(() => {
        parseCustomURLParams();
    }, []);

    const parseCustomURLParams = () => {
        // clean local storage
        window.localStorage.clear();

        const params = new URLSearchParams(location.search);
        // console.log(params.toString());
        const args_custom = params.get("custom_args");
        try {
            if (args_custom) {
                let args_custom_json = JSON.parse(args_custom);
                console.log(args_custom_json);
                setEdges(args_custom_json.edges);
                setNodes(args_custom_json.nodes);
            }
        } catch (e) {
            console.log(e);
        }
    }


    return (

        <TaskExplorer onNextTrialHandler={args.onNextTrialHandler}
                      nodes={nodes}
                      edges={edges}
                      reload={parseCustomURLParams}
        />
    );
};

export const Default = Template.bind({});

Default.args = {
    timer: 25,
    edges: default_data[1].edges,
    nodes: default_data[1].nodes,
    onNextTrialHandler: () => {  location.reload()},
    hideTrial: false
};
