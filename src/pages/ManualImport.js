import React, { Component } from "react";
import { Container, Paper, Button, Typography, IconButton, TextField} from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Alert, AlertTitle } from '@material-ui/lab';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from "axios";
const styles = theme => ({
    formCard: {
        // backgroundColor: "#b2dfdb",
        backgroundColor: "#b2dfdb59",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        [theme.breakpoints.down('xs')]: {
            padding: "30px 3px",
        },
    },
    textContainer: {
        maxWidth: "800px",
        margin: "auto",
        marginTop:"40px",
        marginBottom: "20px",
    },
    articleContainer: {
        display: "flex",
        flexDirection: "column",
        border: 4,
        borderRadius: 3,
        // backgroundColor: "red",
        width: "100%",
        boxShadow: '0 3px 5px 2px #b5dfdcc9',
        margin: "10px 0",
        // padding: "10px 10px",
    },
    mandatoryField: {
        margin:"7px 0",
    },
    authorField: {
        margin:"7px 0",
        width: "90%",
    },
    prevNextButtonContainer: {
        margin: "0 5px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    submitButton: {
        margin: "0 auto",
        marginTop: "20px",
        alignSelf: "flex-start",
    },
    errorAlert: {
        margin: "7px 0",
    },
});

export class ManualImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: {},

            title: "",
            abstract: "",
            venue: "",
            volume: "",
            number: "",
            pages: "",
            year: "",
            type: "",
            key: "",
            doi: "",
            ee: "",
            publisher: "",
            booktitle: "",

            authors: [""],
            metadata: [],
            mandatoryFieldError: "",
            metadataFieldError: "",
            loading: false,
        };
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    addAuthor = () => {
        this.setState(prevState => ({
            authors: [...prevState.authors, ""]
        }))
    }

    removeAuthor = index => {
        this.setState((prevState) => ({
            authors: prevState.authors.filter((_, i) => i !== index)
        }));
    }

    authorHandleChange = (index) => e => {
        let value = e.target.value;
        this.setState(({authors})=>{
            authors[index] = value
            return{
                authors: authors,
            }    
        });
    };

    metadataHandleChange = (e, property, index)  => {
        let value = e.target.value;
        this.setState(({metadata})=>{
            metadata[property][index] = value
            return{
                metadata: metadata,
            }    
        });
    };

    removeMetadata = index => {
        this.setState((prevState) => ({
            metadata: prevState.metadata.filter((_, i) => i !== index)
        }));
    }

    addMetadata = () => {
        this.setState(prevState => ({
            metadata: [...prevState.metadata, ["",""]]
        }))
    }

    renderAuthors = () => {
        const { classes } = this.props;
        let divList = []
        this.state.authors.map((author, authorIndex) => {
            divList.push(
                <div key={`author_${authorIndex}_div`} style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: 'space-between',
                }}>
                    <TextField key={`author_${authorIndex}`} label={`Author ${authorIndex+1}`} 
                        name={`author_${authorIndex}`} onChange={this.authorHandleChange(authorIndex)} 
                        value={author || ""} className={classes.authorField}/>
                        {authorIndex ?
                        <IconButton  
                            onClick={this.removeAuthor.bind(this, authorIndex)}
                            key={`author_${authorIndex}_btn`} >
                            <DeleteForeverIcon color="secondary"/>
                        </IconButton> : null
                    }     
                </div>
            )
        })
        return divList;
    }

    renderMetadata = () => {
        let metadataFields = [];
        this.state.metadata.forEach(([key, value], fieldIndex) => {
            metadataFields.push(
                <div style={{   
                    display:"flex",
                    width: "100%",
                    margin:"7px 0",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: 'space-between',
                    // backgroundColor: "white",
                }} key={`metadata_F_${fieldIndex}`}>
                    <TextField
                        multiline = {true}
                        name={`metadata[fieldIndex][0]`}
                        value={key}
                        onChange={(e)=>{this.metadataHandleChange(e, fieldIndex, 0)}}
                        style={{width: "20%",
                    }} />
                    <TextField 
                        multiline = {true}
                        name={`metadata[fieldIndex][1]`}
                        value={value}
                        onChange={(e)=>{this.metadataHandleChange(e, fieldIndex, 1)}}
                        style={{
                            maxWidth: "60%",
                            minWidth: "60%",
                            alignSelf: "center",
                        }} />
                    <IconButton  
                        onClick={this.removeMetadata.bind(this, fieldIndex)}
                        key={`author_${fieldIndex}_btn`} >
                        <DeleteForeverIcon color="secondary"/>
                    </IconButton>
                </div>
            )
        });
        return metadataFields;
    }

    buildArticleObject = () => {
        this.setState({loading:true})
        let metadata = {}
        
        this.state.metadata.forEach(([key, value], fieldIndex) => {
            metadata[key] = value;
        })
        let article = {
            authors: this.state.authors,
            metadata: metadata,
        }
        {Object.entries(this.state).forEach(([key,value])=>{
            if(typeof(value) === "string" && value !== "" && !["mandatoryFieldError", "metadataFieldError"].includes(key)){
                article[key] = value
            }
        })}
        return article;
    }

    validateFields = () => {
        this.setState({
            mandatoryFieldError: "",
            metadataFieldError: ""
        })
        if(this.state.title === ""){
            this.setState({mandatoryFieldError: `"Title" field cannot be left empty!`})
            return false
        }
        if(this.state.year === ""){
            this.setState({mandatoryFieldError: `"Year" field cannot be left empty!`})
            return false
        }
        if(this.state.ee === ""){
            this.setState({mandatoryFieldError: `"ee" field cannot be left empty!`})
            return false
        }
        if(this.state.authors.some(author => author==="")){
            this.setState({mandatoryFieldError: `"Author" fields cannot be left empty!`})
            return false
        }
        if(this.state.metadata.some(field => field.includes(""))){
            this.setState({metadataFieldError: "Metadata fields cannot be left empty! "+
            "If you wish to not include the metadata field in the record, delete the field by clicking on the delete button."})
            return false
        }
        return true;
    }

    showSuccess = () =>{
        this.setState({stage: 3, timer: 5});
        var countdown = setInterval(()=>{
            if(this.state.timer < 1) {
                clearInterval(countdown);
                return this.props.history.push('/records/view')
            }
            this.setState((prevState)=>({
                timer: prevState.timer-1,
            }));
        }, 1000)
    }

    submitArticle = () => {
        this.setState({loading: true})
        if(!this.validateFields()) return false
        let article = this.buildArticleObject();
        console.log("Submitting:")
        console.log(article)
        axios
            .post(`http://localhost:8080/article/add/`, article)
            .then((res) => {
                console.log(res.data)
                console.log(res)
                this.showSuccess()
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
                this.setState({loading: false, mandatoryFieldError: "Something went wrong!"})
            })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Container color="primary" className={classes.textContainer}>
                    <Typography variant="h6">Manually add a record </Typography>
                </Container>
                <Paper elevation={7} className={classes.formCard}>
                {/* <div className={classes.articleContainer}> */}
                    <Typography variant="h4">Mandatory fields:</Typography>
                    <TextField label="Title" required name="title" onChange={this.handleChange} value={this.state.title} className={classes.mandatoryField} multiline={true}/>
                    <TextField label="Year" required name="year" onChange={this.handleChange} value={this.state.year} className={classes.mandatoryField}/>
                    <TextField label="Full Article ULR" required name="ee" onChange={this.handleChange} value={this.state.ee} className={classes.mandatoryField}/>
                    {this.state.authors ? 
                        <div>
                            {this.renderAuthors()}
                            <IconButton  onClick={this.addAuthor}>
                                <AddCircleIcon color="secondary"/>
                            </IconButton>
                        </div> 
                        : null
                    }

                    <Typography variant="h4">Optional fields:</Typography>
                    <TextField label="Abstract" name="abstract" onChange={this.handleChange} value={this.state.abstract} className={classes.mandatoryField} multiline={true}/>
                    <TextField label="Venue" name="venue" onChange={this.handleChange} value={this.state.venue} className={classes.mandatoryField}/>
                    <TextField label="Volume" name="volume" onChange={this.handleChange} value={this.state.volume} className={classes.mandatoryField}/>
                    <TextField label="Number" name="number" onChange={this.handleChange} value={this.state.number} className={classes.mandatoryField}/>        
                    <TextField label="Pages" name="pages" onChange={this.handleChange} value={this.state.pages} className={classes.mandatoryField}/>
                    <TextField label="Type" name="type" onChange={this.handleChange} value={this.state.type} className={classes.mandatoryField}/>
                    <TextField label="Key" name="key" onChange={this.handleChange} value={this.state.key} className={classes.mandatoryField}/>
                    <TextField label="DOI" name="doi" onChange={this.handleChange} value={this.state.doi} className={classes.mandatoryField}/>
                    {/* <TextField label="URL" name="url"  onChange={this.handleChange} value={this.state.url} className={classes.mandatoryField}/> */}
                    <TextField label="Publisher" name="publisher" onChange={this.handleChange} value={this.state.publisher} className={classes.mandatoryField}/>
                    <TextField label="Booktitle" name="booktitle" onChange={this.handleChange} value={this.state.booktitle} className={classes.mandatoryField}/>
                    
                    <Typography variant="h4">Metadata fields:</Typography>
                    {this.state.metadata ? 
                        <div>
                            {this.renderMetadata()}
                            <IconButton onClick={this.addMetadata}>
                                <AddCircleIcon color="secondary"/>
                            </IconButton>
                        </div> 
                        : null
                    }
                    {this.state.mandatoryFieldError !== "" &&
                        <Alert className={classes.errorAlert} severity="error">{this.state.mandatoryFieldError}</Alert>
                    }
                    {this.state.metadataFieldError !== "" &&
                        <Alert className={classes.errorAlert} severity="error">{this.state.metadataFieldError}</Alert>
                    }

                    <Button disabled={this.state.loading} variant="contained" color="primary" className={classes.submitButton} 
                    onClick={()=>{
                         this.submitArticle()
                    }}>
                        Submit
                    </Button>
                {/* </div> */}
                    {this.state.stage === 3 && 
                        <Container>
                            <Alert variant="filled" severity="success">
                                <AlertTitle>Success!</AlertTitle>
                                The record has been successfully added! You will be redirected to the Records page in <strong>{this.state.timer}</strong>
                            </Alert>
                        </Container>
                    }
                </Paper>
            </div>
        )
    }
}
ManualImport.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ManualImport);