import {Box, CircularProgress, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

interface TimerInterface {
    /** Time in seconds */
    time: number;
}

const Timer: React.FC<TimerInterface> = ({time}) => {
    const [timePassed, setTimePassed] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimePassed(prevTime => prevTime + 1)
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fmtMSS = (s: number) => {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography
                    position="absolute"
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {fmtMSS(time - timePassed)}
                </Typography>

            <CircularProgress variant="determinate" value={((timePassed + time) / time) * 100} size={120}/>
        </Box>
    );

};

export default Timer;