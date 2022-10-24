import React, {FC} from "react";
import {AppBar, Toolbar, Typography, Box} from "@mui/material";
import TutorialTip from "../Tutorial/TutorialTip";

interface HeaderInterface {
    /** Collected in the experiment points */
    totalPoints?: number;
    title?: string;
    /** show tutorial tip */
    showTutorial?: boolean;
    showTip?: boolean;
    /** Callback to handle tutorial tip close */
    onTutorialClose?: () => void;
}

const Header: FC<HeaderInterface> = (props) => {
    const {totalPoints = 0, title = "", showTutorial = false, showTip = true} = props;
    return (
        <Box sx={{flexGrow: 1, height: 80}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>
                    <TutorialTip
                        tutorialId={"practice_total_score"}
                        isTutorial={showTutorial}
                        isShowTip={showTip}
                        onTutorialClose={props.onTutorialClose}
                        placement="bottom"
                    >
                        <Typography variant="h6" sx={{mr: 2}}>
                            {totalPoints && (<>{totalPoints} points</>)}
                        </Typography>
                    </TutorialTip>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
