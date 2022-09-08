import React, {useState} from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import StaticNetwork from './StaticNetwork';
import {Grid, MenuItem, TextField} from "@mui/material";

const data = require('../examples/train.json');

data.forEach((d: any) => {
    d.nodes.forEach((n: any) => {
        n.x = (Math.cos(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
        n.y = (Math.sin(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
    });
});

export default {
    title: 'Network/StaticNetwork',
    component: StaticNetwork
} as ComponentMeta<typeof StaticNetwork>;


const Template: ComponentStory<typeof StaticNetwork> = args => {
    const [currentExample, setCurrentExample] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentExample(parseInt(event.target.value));
        console.log(event.target.value, parseInt(event.target.value), currentExample);
    };

    return (
        <Grid sx={{flexGrow: 1}} direction="row" container spacing={1}>
            <Grid item>
                <StaticNetwork
                    {...args}
                    nodes={data[currentExample].nodes}
                    edges={data[currentExample].edges}
                />
            </Grid>
            <Grid item>
                <TextField
                    id="outlined-basic"
                    select label="Select Network to show"
                    variant="outlined"
                    onChange={handleChange}
                    value={currentExample} sx={{width: '40ch'}}
                >
                    {
                        data.map((net: any, inx: number) => (
                            <MenuItem key={inx} value={inx}> {`${inx} - ${net.network_id}`} </MenuItem>
                        ))
                    }
                </TextField>
            </Grid>

        </Grid>
    )

};

export const TenNodes = Template.bind({});

TenNodes.args = {
    edges: data[0].edges,
    nodes: data[0].nodes,
    size: {width: 550, height: 550},
    nodeSize: 20,
    edgeWidth: 1,
    edgeCurvation: 1
};

export const TenNodesWindnig = Template.bind({});

TenNodesWindnig.args = {
    exampleNum: 0,
    edges: data[0].edges,
    nodes: data[0].nodes,
    size: {width: 550, height: 550},
    nodeSize: 20,
    edgeWidth: 1,
    edgeCurvation: 0.6
};

export const TenNodesSmall = Template.bind({});

TenNodesSmall.args = {
    exampleNum: 0,
    edges: data[0].edges,
    nodes: data[0].nodes,
    size: {width: 350, height: 350},
    nodeSize: 12,
    edgeWidth: 0.7,
    edgeCurvation: 1
};

export const TenNodesExtraSmall = Template.bind({});

TenNodesExtraSmall.args = {
    exampleNum: 0,
    edges: data[0].edges,
    nodes: data[0].nodes,
    size: {width: 250, height: 250},
    nodeSize: 10,
    edgeWidth: 0.5,
    edgeCurvation: 1
};