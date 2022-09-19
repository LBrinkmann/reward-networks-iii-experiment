import React from "react";
import {Typography, Grid, Paper, TextField} from "@mui/material";



const WrittenStrategy: React.FC = () => {
    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 550,
                flexGrow: 1
            }}
        >
            <Grid sx={{flexGrow: 1}} direction="column" container spacing={8} justifyContent="center" alignItems="center">
                <Grid item alignItems="center" style={{ textAlign: "center" }}>
                    <Typography variant="h5" component="div">
                        Please summarize your strategy to be submitted to the next generation.
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        multiline
                        fullWidth
                        rows={6}
                        helperText="Please type at least 50 characters"
                    />
                </Grid>

            </Grid>
        </Paper>
    );
};


export default WrittenStrategy;