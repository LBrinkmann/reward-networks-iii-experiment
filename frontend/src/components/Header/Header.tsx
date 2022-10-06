import React from "react";
import {AppBar, Toolbar, Typography, Box} from "@mui/material";
import TutorialTip from "../TutorialTip";

interface HeaderInterface {
    /** Collected in the experiment points */
    totalPoints?: number;
    /** Index of the tutorial to show */
    tutorialIdx?: number;
    /** Callback to update tutorial index in parents */
    onTutorialClose?: (tutorialIdx: number) => void;
    title?: string;
}

const Header = ({
                    tutorialIdx,
                    onTutorialClose,
                    totalPoints = 0,
                    title = "Reward Networks III"
                }: HeaderInterface) => {
    return (
        <Box sx={{flexGrow: 1, height: 80}}>
            <AppBar position="static">
                <Toolbar>
                    <TutorialTip
                        idx={0}
                        tutorialIdx={tutorialIdx}
                        arrow={false}
                        onTutorialClose={onTutorialClose}
                    >
                        <Typography variant="h6" sx={{flexGrow: 1}}>
                            {title}
                        </Typography>
                    </TutorialTip>
                    <TutorialTip
                        idx={1}
                        tutorialIdx={tutorialIdx}
                        onTutorialClose={onTutorialClose}
                        placement={"bottom-start"}
                    >
                        <Typography variant="h6" sx={{mr: 2}}>
                            {totalPoints > 0 && (<>{totalPoints} points</>)}
                        </Typography>
                    </TutorialTip>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
