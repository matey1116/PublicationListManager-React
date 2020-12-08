import React from 'react'
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles({
//     providerCard:{
//         display: "flex",
//         flexDirection: "row",
//         alignItems: 'center',
//     },
//     linkText: {
//         textDecoration: `none`,
//         textTransform: `uppercase`,
//         color: `white`
//     },   
// });

function DeleteRecordDialog({removeArticle, articles, articleIndex, handleClose}) {
    // const classes = useStyles();
    // const [error, setError] = React.useState("");
    function handleSubmit(){
        axios
            .delete(`http://localhost:8080/article/delete/${articles[articleIndex]._id}`)
            .then((res) => {
                console.log(res)
                // console.log(res.data)
                removeArticle(articleIndex)
                handleClose()
                // this.showSuccess()
            })
            .catch((err) => {
                console.log(err)
                // console.log(err.data)
                // console.log(err.response)
            })
    }
    return (
        <div style={{ 
            backgroundColor: "#dfedec",
            color: "#00796b",
        }}>
            <DialogTitle id="alert-dialog-title">Deleting a record</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this record? 
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary" autoFocus>
                    Delete
                </Button>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </div>
    )
}

export default DeleteRecordDialog
