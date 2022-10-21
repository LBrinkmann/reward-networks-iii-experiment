import {Box, CircularProgress, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import TutorialTip from "../Tutorial/TutorialTip";

interface TimerInterface {
    /** Time in seconds */
    time: number;
    /** Callback to handle timer end */
    OnTimeEndHandler?: () => void;
    /** Pause the timer */
    pause?: boolean;
    /** show tutorial tip */
    showTutorial?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}

const Timer: React.FC<TimerInterface> = (props) => {
    const {time, OnTimeEndHandler, pause = false, showTutorial = false} = props;
    const [timePassed, setTimePassed] = useState<number>(0);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(pause);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const t = JSON.parse(window.localStorage.getItem('timePassed'))
        if (t) setTimePassed(t);
    }, []);

    useEffect(() => {
        if (pause) {
            setIsPaused(true);
        } else {
            setIsPaused(false);
        }
    }, [pause]);

    useEffect(() => {
        if (isDone) {
            OnTimeEndHandler();
        } else if (isPaused) {
            return;
        } else {
            const interval = setInterval(() => {
                setTimePassed(prevTime => prevTime + 1)
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isDone, isPaused]);

    useEffect(() => {
        // save states to local storage to prevent losing state on refresh
        window.localStorage.setItem('timePassed', JSON.stringify(timePassed + 1));

        if (timePassed >= time) {
            window.localStorage.removeItem('timePassed');
            setIsDone(true);
        }
    }, [timePassed]);

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
            onTutorialClose={props.onTutorialClose}
            placement="bottom"
        >
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography position="absolute" variant="h5" component="div" color="text.secondary">
                    {fmtMSS(time - timePassed)}
                </Typography>

                <CircularProgress
                    color={selectColor(timePassed / time)}
                    variant="determinate"
                    value={((timePassed + time) / time) * 100}
                    size={120}/>
            </Box>
        </TutorialTip>
    );

};

export default Timer;