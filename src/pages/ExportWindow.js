import React from 'react'
import Button from '@material-ui/core/Button';
import { Typography, InputLabel, Select, MenuItem, TextField, DialogActions } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Alert } from '@material-ui/lab';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
    }
});

function ExportWindow({handleClose, data, change2faEnabled, ...rest}) {
    const bibtexTypes = ["article", "book", "booklet", "conference", "inbook",
        "incollection", "inproceedings", "manual", "mastersthesis", "misc",
        "phdthesis", "proceedings", "techreport", "unpublished"
    ]
    const classes = useStyles();
    const [checkboxValue, setCheckboxValue] = React.useState('CSV');
    const [articleTypes, setArticleTypes] = React.useState(data.articleTypes);
    const [stage, setStage] = React.useState(1);
    const [timer, setTimer] = React.useState(0);

    function handleSubmit(){
        if(stage===1){
            if(checkboxValue === "BibTeX"){
                return setStage(2)
            }
            axios
                .post("http://localhost:8080/article/export", {
                    articleIDs: articleTypes,
                    exportTo: checkboxValue,
                })
                .then((res) => {
                    let fileExt = checkboxValue.toLowerCase()
                    var exportedFilename = `${new Date().getTime()}.${fileExt}` || `export.${fileExt}`
                    var blob = new Blob([res.data], {type: `text/${fileExt}`})
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, exportedFilename)
                    } 
                    else {
                        var link = document.createElement('a')
                        if (link.download !== undefined) {
                            var url = URL.createObjectURL(blob,{type: `text/${fileExt}`})
                            link.setAttribute('href', url)
                            link.setAttribute('download', exportedFilename)
                            link.style.visibility = 'hidden'
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }
                    }
                    showSuccess()
                })
                .catch((err) => console.log(err))
        }
        else if (stage===2){
            axios
                .post("http://localhost:8080/article/export", {
                    articleIDs: articleTypes,
                    exportTo : checkboxValue,
                })
                .then((res) => {
                    var exportedFilename = `${new Date().getTime()}.bib` || `export.bib`
                    var blob = new Blob([res.data], {type: `text/bib`})
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, exportedFilename)
                    } 
                    else {
                        var link = document.createElement('a')
                        if (link.download !== undefined) {
                            var url = URL.createObjectURL(blob,{type: `text/bib`})
                            link.setAttribute('href', url)
                            link.setAttribute('download', exportedFilename)
                            link.style.visibility = 'hidden'
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }
                    }
                    showSuccess()
                })
                .catch((err) => console.log(err))
        }
        
    }

    React.useEffect(() => {
        console.log("In effect")
        stage === 3 && timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
        if(stage === 3 && timer <= 0) setStage(4) 
    }, [timer]);

    function showSuccess(){
        setStage(3)
        setTimer(5)
    }

    function handleTypeChange(event){
        let typesCopy = {...articleTypes}
        let {name,value} = event.target
        typesCopy[name] = value
        setArticleTypes(typesCopy)
    }

    function handleCheckboxChange(event) {
        setCheckboxValue(event.target.value);
    };

    return (
        <div style={{ 
            backgroundColor: "#dfedec",
            color: "#00796b",
            padding: "30px 25px",
        }}>
            <DialogTitle id="alert-dialog-title">Export as</DialogTitle>
            {stage === 1 ?
                <>
                    <DialogContent>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Choose an exporting option:</FormLabel>
                            <h3>{checkboxValue["5fc7c4d0985d3e3f66148302"]}</h3>
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
                </> : null
            }

            {stage === 2 ?
                <>
                    <DialogContent style={{
                        // width:"300px"
                    }}>
                        <DialogContentText id="alert-dialog-slide-description">
                            To generate BibTeX references, it is mandatory to select the entry type to use as a reference source.
                            Please select an entry type for each of the publications.
                        </DialogContentText>
                        {data.articles.map((article, index) => {
                            return (
                                <div className={classes.articleContainer} key={index}>
                                    <Typography variant="h6">
                                        {article.title}
                                    </Typography>
                                    <FormControl className={classes.formControl}>
                                        {/* <InputLabel id="demo-simple-select-label">@type</InputLabel> */}
                                        <Select
                                            className={classes.typeSelectField}
                                            name={article._id}
                                            value={articleTypes[article._id]}
                                            onChange={handleTypeChange}
                                        >
                                            {bibtexTypes.map((type)=>(
                                                <MenuItem key={`${index}.${type}`} value={type}>{type}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </div>
                                
                            )
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{handleClose()}} color="primary" autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Export
                        </Button>
                    </DialogActions>
                </> : null
            }

            {stage === 3 ?
                <Alert severity="success">
                    The exported file has been downloaded to your device. 
                    You will be redirected to the Records page in <strong>{timer}</strong> seconds!
                </Alert> : null
            }

            {stage === 4 ?
                <Redirect push to="/"/> : null
            }

        </div>
    )
}

export default ExportWindow
