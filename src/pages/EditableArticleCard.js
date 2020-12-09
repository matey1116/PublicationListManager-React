import React, { Component } from "react";
import { Button, Typography, IconButton, TextField} from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const styles = theme => ({
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

export class EditableArticleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: props.article,
            title: props.article.title || "",
            year: props.article.year || "",
            url: props.article.url || "",
            authors: props.article.authors || [],
            metadata: Object.entries(props.article.metadata) || [],
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
                        style={{
                            // marginTop: "8px",
                            width: "20%",
                            // alignSelf: "flex-start"
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
                            backgroundColor:"#b2dfdb",
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
            title: this.state.title,
            year: this.state.year,
            url: this.state.url,
            authors: this.state.authors,
            metadata: metadata,
        }
        return article;
    }

    validateFields = () => {
        this.setState({
            mandatoryFieldError: "",
            metadataFieldError: ""
        })
        if(this.state.title === ""){
            this.setState({mandatoryFieldError: "Title field cannot be left empty!"})
            return false
        }
        if(this.state.year === ""){
            this.setState({mandatoryFieldError: "Year field cannot be left empty!"})
            return false
        }
        if(this.state.url === ""){
            this.setState({mandatoryFieldError: "URL field cannot be left empty!"})
            return false
        }
        if(this.state.authors.some(author => author==="")){
            this.setState({mandatoryFieldError: "Author fields cannot be left empty!"})
            return false
        }
        if(this.state.metadata.some(field => field.includes(""))){
            this.setState({metadataFieldError: "Metadata fields cannot be left empty! "+
            "If you wish to not include the metadata field in the record, delete the field by clicking on the delete button."})
            return false
        }
        return true;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.articleContainer}>
                <Typography variant="h4">Mandatory fields:</Typography>
                <TextField label="Title" name="title" onChange={this.handleChange} value={this.state.title} className={classes.mandatoryField}/>
                <TextField label="Year" name="year" onChange={this.handleChange} value={this.state.year} className={classes.mandatoryField}/>
                <TextField label="URL" name="url"  onChange={this.handleChange} value={this.state.url} className={classes.mandatoryField}/>
                {this.state.authors ? 
                    <div>
                        {this.renderAuthors()}
                        <IconButton  onClick={this.addAuthor}>
                            <AddCircleIcon color="secondary"/>
                        </IconButton>
                    </div> 
                    : null
                }
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
                <div className={classes.prevNextButtonContainer}>
                    {this.props.articleNumber !== 0 ? (
                        <Button variant="outlined" color="primary"
                        disabled={this.state.loading}
                        onClick={()=>{
                            if(this.validateFields()) this.props.previousNextArticle(this.props.articleNumber-1, this.buildArticleObject())
                        }} >
                            <ArrowBackIosIcon/> Previous
                        </Button>
                    ) : <></>}
                    {this.props.articleNumber+1 < this.props.numOfArticles ? (
                        <Button variant="outlined" color="primary"
                        disabled={this.state.loading}
                        onClick={()=>{
                            if(this.validateFields()) this.props.previousNextArticle(this.props.articleNumber+1, this.buildArticleObject())
                        }}>
                            Next <ArrowForwardIosIcon/>
                        </Button>
                    ) : <></>}
                </div>
                


                {this.props.articleNumber+1 === this.props.numOfArticles && (
                    <Button variant="contained" color="primary" className={classes.submitButton} 
                    onClick={()=>{
                        if(this.validateFields()) this.props.submitArticles(this.buildArticleObject())
                    }}>
                        Submit
                    </Button>
                )}

                {this.state.mandatoryFieldError !== "" ?
                    <Alert className={classes.errorAlert} severity="error">{this.state.mandatoryFieldError}</Alert>
                : null}
                
                {this.state.metadataFieldError !== "" ?
                    <Alert className={classes.errorAlert} severity="error">{this.state.metadataFieldError}</Alert>
                : null}
            </div>
        )
    }
}
EditableArticleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EditableArticleCard);