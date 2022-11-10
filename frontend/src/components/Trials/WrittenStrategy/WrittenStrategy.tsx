import React from "react";
import {Typography, Grid, Paper, TextField, Button} from "@mui/material";

interface WrittenStrategyInterface {
    /** On click continue handler */
    onClickContinue: (writtenStrategy: string) => void;
}




const WrittenStrategy: React.FC<WrittenStrategyInterface> = ({onClickContinue}) => {
    const [writtenStrategy, setWrittenStrategy] = React.useState<string>("");

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 200) setWrittenStrategy(event.target.value)
    }

    const onClickContinueHandler = () => {
        onClickContinue(writtenStrategy);
    }

    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 550,
                flexGrow: 1
            }}
        >
            <Grid sx={{flexGrow: 1}} direction="column" container spacing={4}>
                <Grid item style={{ textAlign: "center" }}>
                    <Typography variant="h5" component="div">
                        Please summarize your strategy to be submitted to the next generation.
                    </Typography>
                </Grid>
                <Grid item style={{ margin: 8 }}>
                    <TextField
                        multiline
                        fullWidth
                        margin="normal"
                        rows={6}
                        helperText="Please enter between 50 and 200 characters"
                        value={writtenStrategy}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item style={{ textAlign: "center" }}>
                    {writtenStrategy.length < 50 ? (
                        <Button variant="contained" color="primary" disabled>Continue</Button>
                    ) : (
                        <Button onClick={onClickContinueHandler} variant="contained" color="primary">Continue</Button>
                    )}
                </Grid>

            </Grid>
        </Paper>
    );
};


export default WrittenStrategy;