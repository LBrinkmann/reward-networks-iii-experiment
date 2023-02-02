import React, {FC, useEffect} from "react";
import NetworkTrial from "../../NetworkTrial";
import useNetworkContext from "../../../../contexts/NetworkContext";
import {NETWORK_ACTIONS} from "../../../../reducers/NetworkReducer";


interface IObservation {
    solution: number[];
    /** Delay in ms between each played move. Default is 2000ms. */
    delayBetweenMoves?: number;
    /** Start the animation from the parent component. Default is true. */
    playAnimation?: boolean;
}

const Observation: FC<IObservation> = (props) => {
    const {networkState, networkDispatcher} = useNetworkContext();
    const {solution, playAnimation = true, delayBetweenMoves = 2000} = props;

    useEffect(() => {
        if (playAnimation) {
            setTimeout(() => {
                if (networkState.step < solution.length) {
                    networkDispatcher({
                            type: NETWORK_ACTIONS.NEXT_NODE,
                            payload: {nodeIdx: solution[networkState.step + 1]}
                        }
                    );
                } else {

                }
            }, delayBetweenMoves);
        }

    }, [networkState.step])


    return (
        <>
            <NetworkTrial/>
        </>
    );

}

export default Observation;