import React, {useState} from "react";
import {Grid, Paper} from "@mui/material";
import DynamicNetwork from "../../Network/DynamicNetwork";
import {DynamicNetworkInterface} from "../../Network/DynamicNetwork/DynamicNetwork";


export interface IndividualTrialInterface extends DynamicNetworkInterface {

}

const IndividualTrial: React.FC<IndividualTrialInterface> = (props) => {
    const [step, setStep] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);

    const onNodeClickHandler = (currentNode: number, nextNode: number) => {
        // Update state
        setStep(step + 1);
        // Select current edge
        const currentEdge = props.edges.filter(
            (edge) => edge.source_num === currentNode && edge.target_num === nextNode)[0];
        // Update cumulative reward
        setPoints(points + currentEdge.reward);
    }

    return (
        <Paper sx={{p: 2, margin: 'auto', maxWidth: 550, flexGrow: 1}}>
            <Grid sx={{flexGrow: 1}} direction="column" container spacing={8} justifyContent="center"
                  alignItems="center">
                <Grid item alignItems="center" style={{textAlign: "center"}}>
                    <DynamicNetwork
                        nodes={props.nodes}
                        edges={props.edges}
                        onNodeClickParentHandler={onNodeClickHandler}
                    />
                </Grid>
                <Grid item>
                    Step={step}
                    Cumulative Points={points}
                </Grid>

            </Grid>
        </Paper>
    );
};


export default IndividualTrial;