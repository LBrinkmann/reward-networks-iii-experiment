import React, {FC} from "react";
import {AppBar, Toolbar, Typography, Box} from "@mui/material";
import TutorialTip from "../Tutorial/TutorialTip";
import useSessionContext from "../../contexts/SessionContext";
import {TRIAL_TYPE} from "../Trials/ExperimentTrial";

interface IHeader {
    showTip?: boolean;
}

const Header: FC<IHeader> = ({showTip= true}) => {
    const {sessionState, sessionDispatcher} = useSessionContext();

    const onTutorialClose = () => {
        // sessionDispatcher
    }

    return (
        <Box sx={{flexGrow: 1, height: 80}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {sessionState.trialTitle}
                    </Typography>
                    <TutorialTip
                        tutorialId={"practice_total_score"}
                        isTutorial={sessionState.currentTrialType === TRIAL_TYPE.PRACTICE}
                        isShowTip={showTip}
                        onTutorialClose={onTutorialClose}
                        placement="bottom"
                    >
                        <Typography variant="h6" sx={{mr: 2}}>
                            {sessionState.totalPoints} points
                        </Typography>
                    </TutorialTip>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
