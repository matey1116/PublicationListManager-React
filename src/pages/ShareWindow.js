import React from 'react'
import Button from '@material-ui/core/Button';
import { Collapse, CircularProgress, Typography, InputLabel, Select, MenuItem, TextField, DialogActions } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Alert } from '@material-ui/lab';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { Redirect } from 'react-router-dom'
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
    articleContainer: {
        margin: "20px 0",
        padding: "10px 10px",
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px #b5dfdcc9',
    },
    typeSelectField: {
        margin:"5px 0",
        minWidth: "200px",
    },


    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        // alignItmes: "center",
        // justifyContent: "center",
        
    },
    centerItem: {
        margin:"0 auto",
    },
    spinner: {
        marginBottom: "25px",
    },
});

function ShareWindow({handleClose, articles, ...rest}) {
    const classes = useStyles();
    const [stage, setStage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [timer, setTimer] = React.useState(0);
    const [shareUrl, setShareUrl] = React.useState("");
    const [linkIsCopied, setLinkIsCopied] = React.useState(false);
    const [error, setError] = React.useState(false);
    
    React.useEffect(() => {
        console.log("mounting")
        axios
            .post("http://localhost:8080/share/generate", articles)
            .then((res) => {
                setShareUrl(`https://publicationlistmanager.me/share/${res.data}`)
                setLoading(false)
            })
            .catch((err) => {
                setError(true)
                setLoading(false)
                console.log(err)
            })
    }, []);

    // React.useEffect(() => {
    //     console.log("In effect")
    //     stage === 3 && timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    //     if(stage === 3 && timer <= 0) setStage(4) 
    // }, [timer]);

    function showSuccess(){
        setStage(3)
        setTimer(5)
    }

    function copyLink(){
        console.log("copying")
        navigator.clipboard.writeText(shareUrl)
    }

    return (
        <div style={{ 
            backgroundColor: "#dfedec",
            color: "#00796b",
            padding: "30px 25px",
            width: "100%",
            // minWidth: "250px",
        }}>
            <DialogTitle id="alert-dialog-title">Sharing records</DialogTitle>
            {loading ?
                <DialogContent className={classes.loadingContainer}>
                    <CircularProgress className={`${classes.spinner} ${classes.centerItem}`}/>
                    <Typography variant="h6" className={classes.centerItem}>
                        Generating the sharing link
                    </Typography>
                </DialogContent>
                : null
            }
            {!loading && !error ?
                <DialogContent className={classes.loadingContainer}>
                    <Typography variant="body1" className={classes.centerItem} style={{marginBottom: "5px",}}>
                        Copy the link from below and use it to share the chosen articles!
                    </Typography>
                    <TextField value={shareUrl} className={classes.centerItem}
                        style={{
                            margin:"10px 0",
                        }}
                    />

                    <Collapse in={linkIsCopied}>
                        <Typography variant="body2" style={{color:"green", marginBottom:"10px"}}>
                            The link has been copied to your clipboard!
                        </Typography> 
                    </Collapse>

                    <Button onClick={()=>{
                            copyLink()
                            setLinkIsCopied(true)
                        }} variant="contained" color="primary" style={{width:"max-content"}}>
                        <FileCopyIcon/> Copy link
                    </Button>
                </DialogContent> : null
            }
                
            

            {error ?
                <Alert severity="error">
                    Something went wrong!
                </Alert> : null
            }

            <DialogActions>
                <Button onClick={()=>{handleClose()}} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </div>
    )
}

export default ShareWindow
