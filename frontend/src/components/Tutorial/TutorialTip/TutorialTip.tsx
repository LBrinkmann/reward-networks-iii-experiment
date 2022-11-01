import {Box, Button, CardMedia, Divider, Tooltip, Typography} from "@mui/material";
import React, {FC, useEffect, useState} from "react";
import {tutorialTooltipContent} from "./TutorialTooltipContent";
// @ts-ignore
import rewardsImg from './rewards.png';

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
    /** Show title of the tutorial tip */
    showTitle?: boolean;
}

const TutorialTip: FC<TutorialTipInterface> = (props) => {
    const {
        children,
        isTutorial = false,
        isShowTip = true,
        placement = 'bottom',
        arrow = true,
        showTitle = false
    } = props;

    const [open, setOpen] = useState(isTutorial);

    useEffect(() => {
        setOpen(isTutorial);
    }, [isTutorial]);

    // const {title, text, tip} = tutorialTip[0];
    const {title, text, tip} = tutorialTooltipContent.filter((tip) => tip.id === props.tutorialId)[0];

    const onClose = () => {
        setOpen(false);
        props.onTutorialClose();
    }

    const setTitleAndContent = (name: string, content: string) => (

        <Box sx={{textAlign: "center"}}>
            {/* Hide the title of the tooltip */}
            {showTitle &&
                (
                    <>
                        <Typography color="inherit" variant="h6" sx={{m: 1}}>
                            {name}
                        </Typography>
                        <Divider/>
                    </>
                )
            }
            <Typography color="inherit" sx={{m: 1}}>
                {content}
            </Typography>
            {(name == "Arrow") &&
                (
                    <CardMedia
                        component="img"
                        // height="140"
                        image={rewardsImg}
                        alt="You earn or lose points depending on the color of the arrow."
                    />
                )
            }

            {/* sometimes the tooltip should disappear without the button click */}
            {props.onTutorialClose &&
                (
                    <>
                        <Divider/>
                        <Button sx={{m: 1}} variant="contained" color="secondary" onClick={onClose}>
                            Ok
                        </Button>
                    </>
                )
            }

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
