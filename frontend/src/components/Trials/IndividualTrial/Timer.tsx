import {Box, CircularProgress, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

interface TimerInterface {
    /** Time in seconds */
    time: number;
    /** Callback to handle timer end */
    OnTimeEndHandler?: () => void;
}

const Timer: React.FC<TimerInterface> = ({time, OnTimeEndHandler}) => {
    const [timePassed, setTimePassed] = useState<number>(0);
    const [isDone, setIsDone] = useState<boolean>(false);

    // get states from local storage to prevent losing state on refresh
    useEffect(() => {
        const t = JSON.parse(window.localStorage.getItem('timePassed'))
        if (t) setTimePassed(t);
    }, []);

    useEffect(() => {
        if (isDone) {
            OnTimeEndHandler();
        } else {
            const interval = setInterval(() => {
                setTimePassed(prevTime => prevTime + 1)
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isDone]);

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
    );

};

export default Timer;