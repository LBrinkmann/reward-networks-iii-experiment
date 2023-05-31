import React, {FC} from "react";
import {AppBar, Toolbar, Typography, Box} from "@mui/material";
import TutorialTip from "../Tutorial/TutorialTip";

interface IHeader {
    showTip?: boolean;
    showTutorial?: boolean;
    title?: string;
    onTutorialClose?: () => void;
}

const Header: FC<IHeader> = (props) => {
    const {showTip= true, showTutorial=false, title='', onTutorialClose} = props;

    return (
        <Box sx={{flexGrow: 1, height: 80}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>
                    {/*{totalPoints &&*/}
                    {/*    <TutorialTip*/}
                    {/*        tutorialId={"practice_total_score"}*/}
                    {/*        isTutorial={showTutorial}*/}
                    {/*        isShowTip={showTip}*/}
                    {/*        onTutorialClose={onTutorialClose}*/}
                    {/*        placement="bottom"*/}
                    {/*    >*/}
                    {/*        <Typography variant="h6" sx={{mr: 2}}>*/}
                    {/*            {totalPoints} points*/}
                    {/*        </Typography>*/}
                    {/*    </TutorialTip>*/}
                    {/*}*/}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
