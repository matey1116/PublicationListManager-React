import React from 'react'
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    providerCard:{
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
    },
    linkText: {
        textDecoration: `none`,
        textTransform: `uppercase`,
        color: `white`
    },   
});

function Disable2FA({handleClose, change2faEnabled, ... rest}) {
    const classes = useStyles();
    function handleSubmit(){
        console.log("submitting")
        axios
            .post("http://localhost:8080/account/enable2FA", {
                stage: 1,
                enable: false,
            })
            .then((res) => {
                console.log(res.data)
                handleClose()
                change2faEnabled(false)
                // this.showSuccess()
            })
            .catch((err) => console.log(err))
    }
    return (
        <div style={{ 
            backgroundColor: "#dfedec",
            color: "#00796b",
        }}>
            <DialogTitle id="alert-dialog-title">Two-Factor Authentication</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Two-Factor Authentication makes your profile much safer. 
                Are you sure you want to disable Two-Factor Authentication?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSubmit} color="primary">
                Disable
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
                Cancel
            </Button>
            </DialogActions>
        </div>
    )
}

export default Disable2FA
