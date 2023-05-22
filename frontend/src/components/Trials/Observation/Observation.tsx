import React, {FC, useEffect} from "react";
import NetworkTrial from "../NetworkTrial";
import useNetworkContext from "../../../contexts/NetworkContext";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";
import {Typography} from "@mui/material";


interface IObservation {
    solution: number[];
    teacherId: number;
    /** Delay in ms between each played move. Default is 2000ms. */
    delayBetweenMoves?: number;
    /** Start the animation from the parent component. Default is true. */
    playAnimation?: boolean;
    playerTotalPoints?: number;
}

const Observation: FC<IObservation> = (props) => {
    const {networkState, networkDispatcher} = useNetworkContext();
    const {solution, teacherId, playAnimation = true, delayBetweenMoves = 2000, playerTotalPoints=0} = props;

    useEffect(() => {
        if (playAnimation) {
            setTimeout(() => {
                if (networkState.step + 1 < solution.length) {
                    networkDispatcher({
                            type: NETWORK_ACTIONS.HIGHLIGHT_EDGE_TO_CHOOSE,
                            payload: {
                                source: solution[networkState.step],
                                target: solution[networkState.step + 1],
                                edgeStyle: "highlighted"
                            }
                        }
                    );
                    networkDispatcher({
                            type: NETWORK_ACTIONS.NEXT_NODE,
                            payload: {nodeIdx: solution[networkState.step + 1]}
                        }
                    );
                } else {
                    networkDispatcher({type: NETWORK_ACTIONS.RESET_EDGE_STYLES});
                }
            }, delayBetweenMoves);
        }

    }, [networkState.step, playAnimation])

    return (
        <>
            <Typography variant="h3" align='center'>
                Watch player {teacherId} solving the task
            </Typography>
            <NetworkTrial showComment={false} teacherId={teacherId} isTimerPaused={true}
                          playerTotalPoints={playerTotalPoints}
            />
        </>
    );
}

export default Observation;