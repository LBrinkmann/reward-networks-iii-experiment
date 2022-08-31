import React from "react";
import {Button, Grid, Typography} from "@mui/material";

const ConsentForm: React.FC = () => {
    return (
        <div>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h3" component="h2"> Consent Form </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi eget
                        consectetur consectetur, nisi nisi consectetur nisi, eget consectetur nisi nisi eget
                        consectetur nisi. Donec euismod, nisi eget consectetur consectetur, nisi nisi consectetur nisi,
                        eget
                        consectetur nisi nisi eget consectetur nisi. Donec euismod, nisi eget consectetur consectetur,
                        nisi
                        nisi consectetur nisi, eget consectetur nisi nisi eget consectetur nisi. Donec euismod, nisi
                        eget
                        consectetur consectetur, nisi nisi consectetur nisi, eget consectetur nisi nisi eget consectetur
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Button variant="contained" color="success">️I Agree</Button>
                </Grid>
            </Grid>
        </div>
    );
};


export default ConsentForm;