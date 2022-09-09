import React, {ReactChildren, ReactElement, ReactNode, useState} from "react";
import {Grid, MenuItem, TextField} from "@mui/material";


const data = require('../examples/train.json');

data.forEach((d: any) => {
    d.nodes.forEach((n: any) => {
        n.x = (Math.cos(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
        n.y = (Math.sin(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
    });
});

interface NetworkWrapperInterface {
    child: ReactChildren | ReactNode | ReactElement;
}


const NetworkWrapper = ({child}: NetworkWrapperInterface) => {
    const [currentExample, setCurrentExample] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentExample(parseInt(event.target.value));
        console.log(event.target.value, parseInt(event.target.value), currentExample);
    };

    return (
        <Grid sx={{flexGrow: 1}} direction="row" container spacing={1}>
            <Grid item>
                {
                    React.cloneElement(child as ReactElement<any>,
                        {
                            nodes: data[currentExample].nodes,
                            edges: data[currentExample].edges,
                        }
                    )
                }
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


export default NetworkWrapper;