import React, { Component } from "react";
import { Button, Link, Container, Typography, Paper, FormControl, FormHelperText, InputLabel, InputAdornment, Input, IconButton, TextField} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from "axios";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Link as routingLink } from "react-router-dom";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const styles = theme => ({
    articleContainer: {
        display: "flex",
        flexDirection: "column",
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px #b5dfdcc9',
        margin: "10px 0",
        padding: "10px 10px",
    },
    mandatoryField: {
        margin:"7px 0",
    }
});

export class EditableArticleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: props.article,
            title: props.article.title,
            year: props.article.year,
            url: props.article.url,
            authors: props.article.authors,
            metadata: Object.entries(props.article.metadata),
            errors: {},
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    addAuthor = () => {
        this.setState(prevState => ({
            authors: [...prevState.authors, ""]
        }))
    }

    removeAuthor = index => {
        this.setState((prevState) => ({
            authors: prevState.authors.filter((_, i) => i != index)
        }));
    }

    authorHandleChange = (action, index) => e => {
        let value = e.target.value;
        switch(action) {
            case "update":
                this.setState(({authors})=>{
                    authors[index] = value
                    return{
                        authors: authors,
                    }    
                });
              break;
            // case "delete":
        }
    };

    metadataHandleChange = (e, property, index)  => {
        console.log("changing metadata called")
        console.log(`property: ${property}, index: ${index}`)
        let value = e.target.value;
        this.setState(({metadata})=>{
            metadata[property][index] = value
            return{
                metadata: metadata,
            }    
        });
    };

    renderAuthors = () => {
        const { classes } = this.props;
        let divList = []
        this.state.authors.map((author, authorIndex) => {
            divList.push(
                <div key={`author_${authorIndex}_div`} style={{
                    backgroundColor:"white",
                    borderBottomP: "3px",
                }}>
                    <TextField key={`author_${authorIndex}`} label={`Author ${authorIndex+1}`} 
                        name={`author_${authorIndex}`} onChange={this.authorHandleChange("update", authorIndex)} 
                        value={author || ""} className={classes.mandatoryField}/>
                        {authorIndex ?
                        <Button  
                            onClick={this.removeAuthor.bind(this, authorIndex)}
                            key={`author_${authorIndex}_btn`} >
                            <DeleteForeverIcon color="secondary"/>
                        </Button> : null
                    }     
                </div>
            )
        })
        return divList;
    }

    renderMetadata = () => {
        let metadataFields = [];
        this.state.metadata.forEach(([key, value], fieldIndex) => {
            console.log("running "+ fieldIndex)
            metadataFields.push(
                <div style={{   
                    display:"flex",
                    width: "100%",
                    margin:"7px 0",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    justifyContent: 'space-between',
                    // backgroundColor: "blue",
                }} key={`metadata_F_${fieldIndex}`}>
                    <TextField
                        multiline = {true}
                        name={`metadata[fieldIndex][0]`}
                        value={key}
                        onChange={(e)=>{this.metadataHandleChange(e, fieldIndex, 0)}}
                        style={{
                            width: "30%",
                            alignSelf: "flex-start"
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
                </div>
            )
        });
        return metadataFields;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.articleContainer}>
                {this.state.title}
                <TextField label="title" name="title" onChange={this.handleChange} value={this.state.title} className={classes.mandatoryField}/>
                <TextField label="year" name="year" onChange={this.handleChange} value={this.state.year} className={classes.mandatoryField}/>
                <TextField label="url" name="url"  onChange={this.handleChange} value={this.state.url} className={classes.mandatoryField}/>
                {this.state.authors ? 
                    <div>
                        {this.renderAuthors()}
                        <Button onClick={this.addAuthor}>
                            <AddCircleIcon color="secondary"/>
                        </Button>
                    </div> 
                    : null
                }
                {this.state.metadata ? 
                    <div>
                        {/* {this.renderMetadata()} */}
                        {this.renderMetadata()}
                        {/* <Button onClick={this.addAuthor}>
                            <AddCircleIcon color="secondary"/>
                        </Button> */}
                    </div> 
                    : null
                }
                <h3>{this.state.article.title}</h3>
                {this.state.article.authors && <div><strong>Authors:</strong> {this.state.authors.join(", ")}</div>}
                {this.state.article.year && <div><strong>Year:</strong> {this.state.article.year}</div>}
                {this.state.article.url && <div><strong>URL:</strong> {this.state.article.url}</div>}
                {/* {metadata && <div><strong>Metadata:</strong> {metadata}</div>} */}
            </div>
        )
    }
}
EditableArticleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EditableArticleCard);

