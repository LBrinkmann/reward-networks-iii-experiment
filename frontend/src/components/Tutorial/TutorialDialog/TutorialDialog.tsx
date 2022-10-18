import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {FC, useEffect, useState} from "react";


interface TutorialDialogInterface {
    isOpen: boolean;
    title: string;
    content: string;
    onClose?: () => void;
}

const TutorialDialog: FC<TutorialDialogInterface> = (props) => {
    const {isOpen = false} = props;
    const [open, setOpen] = useState(isOpen);

    // update state when props change
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>

    );
}


export default TutorialDialog;