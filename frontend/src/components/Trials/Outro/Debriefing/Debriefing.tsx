import React from "react";
import {Box, Button, Grid, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface DebriefingProps {
    redirect: string;
}


const Debriefing: React.FC<DebriefingProps> = (props: DebriefingProps) => {

    const onClick = () => {
        window.open(props.redirect, "_blank");
    }

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Box sx={{width: '75%'}}
                         m="auto" // box margin auto to make box in the center
                         style={{maxHeight: '80vh', overflow: 'auto'}}  //maxHeight: 300,
                         p={3} // box padding
                    >
                        <Typography variant="body1" paragraph>
                            Thank you for participating in the experiment. In this study, we are interested in the
                            impact of superior AI solutions on the evolution of performance in the task you took part
                            in. As we informed you in the beginning, some (rare) participants had the chance to learn
                            from AI solutions, not only human solutions. We built the networks in such a way that a
                            certain strategy (taking an early loss) is very valuable, but not easily discoverable for
                            humans. Yet AI has no problem discovering and transmitting this solution. By splitting the
                            sample of participants into two groups (one with AI and one without), we hope to show that
                            the group with AI can culturally transmit these solutions even among later generations of
                            humans and consistently outperform the human-only group.
                        </Typography>

                        <Grid item xs={12} textAlign={"center"} p={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={onClick}
                                startIcon={<CheckIcon/>}>️
                                Finish the study
                            </Button>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};


export default Debriefing;