import React from "react";
import {AppBar, Toolbar, Typography, Box} from "@mui/material";

interface HeaderInterface {
    /** Collected in the experiment points */
    totalPoints?: number;
    title?: string;
}

const Header = ({totalPoints = 0, title = "Reward Networks III"}: HeaderInterface) => {
    return (
        <Box sx={{flexGrow: 1, height: 80}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>

                    <Typography variant="h6" sx={{mr: 2}}>
                        {totalPoints > 0 && (<>{totalPoints} points</>)}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
