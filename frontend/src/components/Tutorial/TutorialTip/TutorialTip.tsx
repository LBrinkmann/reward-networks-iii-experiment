import {Divider, Typography, Tooltip, Button, Box} from "@mui/material";
import React, {FC, useEffect, useState} from "react";

const tutorialTip = [
    {
        id: "practice_node",
        title: "Network Nodes",
        text: "You start at the highlighted circle in the network.",
        tip: "Click a node",
    },
    {
        id: "practice_step_score",
        title: "Score & Step",
        text: "You always have 8 moves per network. Your goal is to collect the maximum total number of points in these 8 moves.",
        tip: "Current step and cumulative score",
    },
    {
        id: "social_learning_selection_player",
        title: "Player selection",
        text: `Select a player to see the solution of this player`,
        tip: "Select a player",
    },
];

interface TutorialTipInterface {
    /** children of the tutorial component */
    children: any;
    /** index of the tutorial tip to show */
    tutorialId: string;
    isTutorial?: boolean;
    isShowTip?: boolean;
    /** placement of the tip
     * See more info here: https://mui.com/material-ui/api/tooltip/ */
    placement?: any;
    /** If true, adds an arrow to the tooltip
     * See more info here: https://mui.com/material-ui/api/tooltip/ */
    arrow?: boolean;
    /** Callback to update parent tutorial index */
    onTutorialClose?: () => void;
}

const TutorialTip: FC<TutorialTipInterface> = (props) => {
    const {children, isTutorial = false, isShowTip = true, placement = 'bottom', arrow = true} = props;

    const [open, setOpen] = useState(isTutorial);

    useEffect(() => {
        setOpen(isTutorial);
    }, [isTutorial]);

    // const {title, text, tip} = tutorialTip[0];
    const {title, text, tip} = tutorialTip.filter((tip) => tip.id === props.tutorialId)[0];

    const onClose = () => {
        setOpen(false);
        props.onTutorialClose();
    }

    const setTitleAndContent = (name: string, content: string) => (
        <Box sx={{textAlign: "center"}}>
            <Typography color="inherit" variant="h6" sx={{m: 1}}>
                {name}
            </Typography>
            <Divider/>
            <Typography color="inherit" sx={{m: 1}}>
                {content}
            </Typography>
            <Divider/>
            <Button sx={{m: 1}} variant="contained" color="secondary" onClick={onClose}>
                Ok
            </Button>
        </Box>
    )

    const renderTip = () => {
        if (!(text && title && tip)) return children;
        if (isTutorial) {
            return (
                <Tooltip
                    title={setTitleAndContent(title, text)}
                    placement={placement}
                    arrow={arrow}
                    open={open}
                >
                    {children}
                </Tooltip>
            );
        } else if (isShowTip) {
            return (
                <Tooltip title={tip} placement={placement} arrow={arrow}>
                    {children}
                </Tooltip>
            );
        } else {
            return children;
        }
    }

    return renderTip();
};

export default TutorialTip;
