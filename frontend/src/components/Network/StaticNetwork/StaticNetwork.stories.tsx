import React, {useState} from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import StaticNetwork from './StaticNetwork';
import {Grid, MenuItem, TextField} from "@mui/material";

import data from '../../Network/examples';

export default {
    title: 'Network/StaticNetwork',
    component: StaticNetwork
} as ComponentMeta<typeof StaticNetwork>;


const Template: ComponentStory<typeof StaticNetwork> = args => {
    const [currentExample, setCurrentExample] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentExample(parseInt(event.target.value));
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
    nodeSize: 25,
    edgeWidth: 2.5,
    showRewardText: false,
    size: 470,
    edges: data[0].edges,
    nodes: data[0].nodes,
};
