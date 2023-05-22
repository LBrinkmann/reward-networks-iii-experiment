import NetworkTrial from "../NetworkTrial";
import React, {FC, useEffect} from "react";
import useNetworkContext from "../../../contexts/NetworkContext";
import {Typography} from "@mui/material";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";


interface IRepeat {
    solution: number[];
    teacherId: number;
    playerTotalPoints: number;
}

const Repeat: FC<IRepeat> = ({solution, teacherId, playerTotalPoints}) => {
    const {networkState, networkDispatcher} = useNetworkContext();

    useEffect(() => {
        if (networkState.step + 1 < solution.length) {
            networkDispatcher({
                    type: NETWORK_ACTIONS.HIGHLIGHT_EDGE_TO_CHOOSE,
                    payload: {
                        source: solution[networkState.step],
                        target: solution[networkState.step + 1],
                        edgeStyle: "animated"
                    }
                }
            );
        } else {
            networkDispatcher({type: NETWORK_ACTIONS.RESET_EDGE_STYLES});
        }


    }, [networkState.step]);


    return (
        <>
            <Typography variant="h3" align='center'>
                Repeat the solution by following the dashed line
            </Typography>
            <NetworkTrial showComment={true} teacherId={teacherId} playerTotalPoints={playerTotalPoints}/>
        </>
    );

}


export default Repeat;