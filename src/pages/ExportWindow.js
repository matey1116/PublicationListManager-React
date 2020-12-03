import React from 'react'
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

function ExportWindow({handleClose, data, change2faEnabled, ...rest}) {
    const classes = useStyles();
    const [checkboxValue, setCheckboxValue] = React.useState('CSV');
    const [articleTypes, setArticleTypes] = React.useState(data.articleTypes);
    console.log(data)
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

    function handleCheckboxChange(event) {
        // console.log("changing to:"+value)
        setCheckboxValue(event.target.value);
    };
    return (
        <div style={{ 
            backgroundColor: "#dfedec",
            color: "#00796b",
            padding: "30px 25px",
        }}>
            <DialogTitle id="alert-dialog-title">Export as</DialogTitle>
            <DialogContent>
                {/* <DialogContentText id="alert-dialog-description"> */}
                {/* </DialogContentText> */}
                
                <FormControl component="fieldset">
                    <FormLabel component="legend">Choose an exporting option:</FormLabel>
                    {/* <h3>{checkboxValue}</h3> */}
                    <RadioGroup name="export" value={checkboxValue} onChange={handleCheckboxChange}>
                        <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
                        <FormControlLabel value="XML" control={<Radio />} label="XML" />
                        <FormControlLabel value="BibTeX" control={<Radio />} label="BibTeX" />
                    </RadioGroup>
                </FormControl>
                
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>{handleClose()}} color="primary" autoFocus>
                Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
                Export
            </Button>
            </DialogActions>
        </div>
    )
}

export default ExportWindow
