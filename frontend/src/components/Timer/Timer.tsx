import {Box, CircularProgress, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import TutorialTip from "../Tutorial/TutorialTip";
import useNetworkContext from "../../contexts/NetworkContext";
import {NETWORK_ACTIONS} from "../../reducers/NetworkReducer";

interface TimerInterface {
    /** Time in seconds */
    time: number;
    /** Invisible time: time when timer has no visual changes but the time is ticking */
    invisibleTime?: number;
    /** Pause the timer */
    pause?: boolean;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}

const Timer: React.FC<TimerInterface> = (props) => {
    const {time, invisibleTime = 0, pause = false, showTutorial = false, onTutorialClose} = props;
    const {networkState, networkDispatcher} = useNetworkContext();

    useEffect(() => {
        const interval = setInterval(() => {
            networkDispatcher({
                    type: NETWORK_ACTIONS.TIMER_UPDATE,
                    payload: {time: time, paused: pause}
                }
            )
        }, 1000);
        return () => clearInterval(interval);

    }, [networkState.timer.timePassed, pause, time]);


    // Convert seconds to minutes and seconds
    const fmtMSS = (s: number) => {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    // Change the color of the progress circle based on the time left in percent
    const selectColor = (timeLeft: number) => {
        if (timeLeft > 0.9) {
            return "error";
        } else if (timeLeft > 0.6) {
            return "warning";
        } else {
            return "success";
        }
    }

    return (
        <TutorialTip
            tutorialId={"practice_timer"}
            isTutorial={showTutorial}
            isShowTip={false}
            onTutorialClose={onTutorialClose}
            placement={"right"}
        >
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography position="absolute" variant="h5" component="div" color="text.secondary">
                    {invisibleTime - networkState.timer.timePassed < 0 ?
                        // show the time left
                        fmtMSS(time - networkState.timer.timePassed) :
                        // show the total visible time
                        fmtMSS(time - invisibleTime)
                    }
                </Typography>

                <CircularProgress
                    color={selectColor(networkState.timer.timePassed / time)}
                    variant="determinate"
                    value={
                        invisibleTime - networkState.timer.timePassed < 0 ?
                            // show the time left clockwise: 100% + time passed in %
                            // it is necessary to subtract the invisible time
                            ((networkState.timer.timePassed - invisibleTime + time - invisibleTime) / (time - invisibleTime)) * 100 :
                            // show the full circle
                            100
                    }
                    size={120}/>
            </Box>
        </TutorialTip>
    );

};

export default Timer;