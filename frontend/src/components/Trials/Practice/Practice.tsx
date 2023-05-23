import React, {FC} from "react";
import NetworkTrial from "../NetworkTrial";
import useNetworkContext from "../../../contexts/NetworkContext";


interface IPractice {

}

const Practice: FC<IPractice> = () => {
    const {networkState, networkDispatcher} = useNetworkContext();


    return <NetworkTrial
        showLegend={true}
        showComment={false}
        showLinearNetwork={true}
        showTimer={networkState.tutorialOptions.time || networkState.tutorialStep > 4}
        isTimerPaused={true}
        isPractice={true}
        playerTotalPoints={0}
    />
}


export default Practice