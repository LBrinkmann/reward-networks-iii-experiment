import React from "react";
import {AppBar, Toolbar, Typography, Box} from "@mui/material";
import TutorialTip from "./tutorial";

interface Props {
    totalPoints?: number;
    tutorialIdx?: number;
    onTutorialClose?: (tutorialIdx: number) => void;
}

const ButtonAppBar = ({
                          tutorialIdx,
                          onTutorialClose,
                          totalPoints = 0,
                      }: Props) => {
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
                            Reward Networks II
                        </Typography>
                    </TutorialTip>
                    <TutorialTip
                        idx={1}
                        tutorialIdx={tutorialIdx}
                        onTutorialClose={onTutorialClose}
                        placement={"bottom-start"}
                    >
                        <Typography variant="h6" sx={{mr: 2}}>
                            {totalPoints} points
                        </Typography>
                    </TutorialTip>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default ButtonAppBar;
