import React, {FC, useCallback, useEffect, useState} from "react";
import NetworkTrial from "../NetworkTrial";
import useNetworkContext from "../../../contexts/NetworkContext";
import TutorialTip from "../../Tutorial/TutorialTip";
import {NETWORK_ACTIONS} from "../../../reducers/NetworkReducer";


interface IPractice {
    onLastTutorialStep: () => void;
}

const Practice: FC<IPractice> = ({onLastTutorialStep}) => {
    const [tutorialId, setTutorialId] = useState("start");
    const {networkState, networkDispatcher} = useNetworkContext();

    useEffect(() => {
        if (networkState.tutorialOptions.start) setTutorialId("start");
        else if (networkState.tutorialOptions.general_edge) setTutorialId("general_edge");
        else if (networkState.tutorialOptions.general_points) setTutorialId("general_points");
    }, [networkState.tutorialOptions])

    useEffect(() => {
        if (networkState.tutorialStep > 9)
        {
            // wait for 3 seconds and end the practice
            const timer = setTimeout(() => {
                onLastTutorialStep();
            }, 1000);

            return () => {
                clearTimeout(timer);
            }
        }
    }, [networkState.tutorialOptions.totalScore]);

    const OnTutorialTipClose = useCallback(() => {
        networkDispatcher({type: NETWORK_ACTIONS.NEXT_TUTORIAL_STEP});
    }, [])

    return (
        <>
            <TutorialTip
                tutorialId={tutorialId}
                isTutorial={
                    networkState.tutorialOptions.start ||
                    networkState.tutorialOptions.general_edge ||
                    networkState.tutorialOptions.general_points}
                isShowTip={false}
                onTutorialClose={OnTutorialTipClose}
                arrow={false}
                placement="left"
            >
                {/*div in the center of the screen with width 100*/}
                <div style={{position: "absolute", top: "30%", left: "35%"}} />
            </TutorialTip>
            <NetworkTrial
                showLegend={networkState.tutorialOptions.edge || networkState.tutorialStep > 3}
                showComment={false}
                showLinearNetwork={networkState.tutorialOptions.linearSolution || networkState.tutorialStep > 5}
                showTimer={networkState.tutorialOptions.time || networkState.tutorialStep > 6}
                isTimerPaused={true}
                isPractice={true}
                playerTotalPoints={0}
                showCurrentNetworkPoints={networkState.tutorialOptions.points || networkState.tutorialStep > 7}
                showTotalPoints={networkState.tutorialOptions.totalScore || networkState.tutorialStep > 8}
            />
        </>
    )
}


export default Practice