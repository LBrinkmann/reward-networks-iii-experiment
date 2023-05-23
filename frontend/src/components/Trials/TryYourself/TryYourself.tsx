import NetworkTrial from "../NetworkTrial";
import React, {FC} from "react";
import useNetworkContext from "../../../contexts/NetworkContext";
import {Box, Button, Typography} from "@mui/material";
import LinearSolution from "../../Network/LinearSolution";


interface ITryYour {
    solution: number[];
    teacherId: number;
    teacherTotalScore: number;
    endTrial: (data: any) => void;
    teacherWrittenSolution: string;
    playerTotalPoints: number;
}

const TryYourself: FC<ITryYour> = ({solution, teacherId, teacherTotalScore, endTrial, teacherWrittenSolution, playerTotalPoints}) => {
    const {networkState} = useNetworkContext();

    return (
        <>
            {networkState.isNetworkFinished ? (

                <Box
                    sx={{width: '600px'}}
                    justifyContent="center"
                    alignItems="center"
                    style={{margin: 'auto', marginTop: '8%'}}
                >
                    {/*<Typography variant="h6" gutterBottom align={'left'}>*/}
                    {/*    Player {teacherId} comment:*/}
                    {/*</Typography>*/}
                    {/*<Typography variant="body1" gutterBottom align={'justify'}>*/}
                    {/*    {teacherWrittenSolution}*/}
                    {/*</Typography>*/}
                    <Typography variant="h6" gutterBottom align={'left'}>
                        Player {teacherId} total score: {teacherTotalScore}
                    </Typography>
                    <LinearSolution
                        edges={networkState.network.edges}
                        nodes={networkState.network.nodes}
                        moves={solution}
                        id={150}
                    />
                    <Typography variant="h6" gutterBottom align={'left'}>
                        Your solution total score: {networkState.points}
                    </Typography>
                    <LinearSolution
                        edges={networkState.network.edges}
                        nodes={networkState.network.nodes}
                        moves={networkState.moves}
                        showTutorial={networkState.tutorialOptions.linearSolution}
                        id={200}
                    />
                    <Box textAlign="center" marginTop="20px">
                        <Button onClick={() => endTrial({moves: networkState.moves})} variant="contained"
                                color="primary">Continue</Button>
                    </Box>

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