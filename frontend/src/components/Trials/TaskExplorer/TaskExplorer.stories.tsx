import React, {ChangeEvent, useState} from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import TaskExplorer from "./TaskExplorer";

import default_data from "../../Network/examples";
import {Button, Grid, MenuItem, TextField} from "@mui/material";

export default {
    title: 'Utils/TaskExplorer',
    component: TaskExplorer,
} as ComponentMeta<typeof TaskExplorer>;

const Template: ComponentStory<typeof TaskExplorer> = function (args) {
    const [data, setData] = React.useState(default_data);
    const [currentExample, setCurrentExample] = useState<number>(1);

    const getData = (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0], "UTF-8");
        reader.onload = (e) => {
            // parse file
            let new_data = JSON.parse(e.target.result.toString());
            // update data
            new_data.forEach((net: any) => {
                net.nodes[net.starting_node].starting_node = true;
            });
            if (new_data.length > 0) {
                setCurrentExample(0);
                setData(new_data);
            }
            // console.log(new_data);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentExample(parseInt(event.target.value));
    };

    return (
        <>
            <TaskExplorer {...args}
                          nodes={data[currentExample].nodes}
                          edges={data[currentExample].edges}
            />

            <Grid container direction="row" justifyContent="space-around" spacing={3}>
                <Grid item>
                    <input
                        style={{display: "none"}}
                        id="contained-button-file"
                        type="file"
                        onChange={getData}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Upload Networks
                        </Button>
                    </label>
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
        </>
    );
};

export const Default = Template.bind({});

Default.args = {
    timer: 25,
    edges: default_data[1].edges,
    nodes: default_data[1].nodes,
    onNextTrialHandler: () => {
        location.reload()
    },
    hideTrial: false
};
