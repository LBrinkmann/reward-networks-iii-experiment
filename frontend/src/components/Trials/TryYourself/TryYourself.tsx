import NetworkTrial from "../NetworkTrial";
import React, {FC} from "react";
import useNetworkContext from "../../../contexts/NetworkContext";
import {Box, Button, Typography, Grid} from "@mui/material";
import LinearSolution from "../../Network/LinearSolution";


interface ITryYour {
    solution: number[];
    teacherId: number;
    teacherTotalScore: number;
    endTrial: (data: any) => void;
    teacherWrittenSolution: string;
    playerTotalPoints: number;
}

const TryYourself: FC<ITryYour> = ({
                                       solution,
                                       teacherId,
                                       teacherTotalScore,
                                       endTrial,
                                       teacherWrittenSolution,
                                       playerTotalPoints
                                   }) => {
    const {networkState} = useNetworkContext();

    return (
        <>
            {networkState.isNetworkFinished ? (

                <Box
                    justifyContent="center"
                    alignItems="center"
                    style={{margin: 'auto', marginTop: '8%'}}
                >
                    <Grid container direction="column" justifyContent="center">
                        {/*<Typography variant="h6" gutterBottom align={'left'}>*/}
                        {/*    Player {teacherId} comment:*/}
                        {/*</Typography>*/}
                        {/*<Typography variant="body1" gutterBottom align={'justify'}>*/}
                        {/*    {teacherWrittenSolution}*/}
                        {/*</Typography>*/}

                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Grid item xs={2}>
                                <Typography variant="h6" align={'left'}>
                                    Player {teacherId}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{maxWidth: '600px'}}>
                                <LinearSolution
                                    edges={networkState.network.edges}
                                    nodes={networkState.network.nodes}
                                    moves={solution}
                                    id={150}
                                    showStepsLabel={false}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="h6" align={'left'}>
                                    Total score: {teacherTotalScore}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Grid item xs={2}>
                                <Typography variant="h6" align={'left'}>
                                    You
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{maxWidth: '600px'}}>
                                <LinearSolution
                                    edges={networkState.network.edges}
                                    nodes={networkState.network.nodes}
                                    moves={networkState.moves}
                                    showTutorial={networkState.tutorialOptions.linearSolution}
                                    id={200}
                                    showStepsLabel={false}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="h6" align={'left'}>
                                    Total score: {networkState.points}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box textAlign="center" marginTop="20px">
                            <Button onClick={() => endTrial({moves: networkState.moves})} variant="contained"
                                    color="primary">Continue</Button>
                        </Box>

                    </Grid>

                </Box>
            ) : (
                <>
                    <Typography variant="h3" align='center'>
                        Try to beat player {teacherId}'s score: {teacherTotalScore}!
                    </Typography>
                    <NetworkTrial playerTotalPoints={playerTotalPoints} showTotalPoints={false}/>
                </>
            )}
        </>
    );

}


export default TryYourself;