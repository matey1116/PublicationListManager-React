import React, { Component } from "react";
import { Button, Typography, IconButton, TextField, } from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import axios from "axios";

import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const styles = theme => ({
    articleContainer: {
        display: "flex",
        flexDirection: "column",
        border: 4,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px #b5dfdcc9',
        backgroundColor: "#dfedec",
        color: "#00796b",
        padding: "30px 30px",
        width: "800px",
        [theme.breakpoints.down('sm')]: {
            padding: "30px 3px",
            width: "100%",
        },
    },
    mandatoryField: {
        margin:"7px 0",
    },
    authorField: {
        margin:"7px 0",
        width: "90%",
    },
    errorAlert: {
        margin: "7px 0",
    },
});

export class EditRecordDialog extends Component {
    constructor(props) {
        super(props);
        const {articleNumber,articles} = props;
        const article = articles[articleNumber]
        
        console.log(article)
        this.state = {
            article: {...article},
            // title: article.title || "",
            // year: article.year || "",
            // url: article.url || "",
            authors: [...article.authors] || [],
            metadata: article.metadata ? Object.entries(article.metadata) : [],
            mandatoryFieldError: "",
            metadataFieldError: "",
            loading: false,
            editable: false,
            articleIsEdited: false,
        };
        
        // Object.entries(article).map(([key,value])=>{
        //     if(typeof(value) === "string" && !["_id"].includes(key)){
        //         // this.state[key] = value || ""
        //         this.setState({[key]: value})
        //     }
        // })
    }

    componentDidMount(){
        const {articleNumber,articles} = this.props;
        const article = articles[articleNumber]
        Object.entries(article).forEach(([key,value])=>{
            if(typeof(value) === "string" && !["_id"].includes(key)){
                this.setState({[key]: value})
            }
        })
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
                        value={author || ""} className={classes.authorField} 
                        // disabled={true}
                        InputProps={{readOnly: !this.state.editable}}
                        />
                        {authorIndex && this.state.editable ?
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
                    // flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: 'space-between',
                    // backgroundColor: "white",
                }} key={`metadata_F_${fieldIndex}`}>
                    <TextField
                        multiline = {true}
                        name={`metadata[fieldIndex][0]`}
                        value={key}
                        InputProps={{readOnly: !this.state.editable}}
                        onChange={(e)=>{this.metadataHandleChange(e, fieldIndex, 0)}}
                        style={{
                            // marginTop: "8px",
                            width: "20%",
                            // alignSelf: "flex-start"
                        }} />
                    <TextField 
                        multiline={true}
                        name={`metadata[fieldIndex][1]`}
                        value={value}
                        InputProps={{readOnly: !this.state.editable}}

                        onChange={(e)=>{this.metadataHandleChange(e, fieldIndex, 1)}}
                        style={{
                            maxWidth: "75%",
                            minWidth: "75%",
                            alignSelf: "center",
                            // backgroundColor:"#b2dfdb",
                        }} />
                    {this.state.editable &&
                        <IconButton  
                            style={{width:"5%", height: "5%"}}
                            onClick={this.removeMetadata.bind(this, fieldIndex)}
                            key={`author_${fieldIndex}_btn`} >
                            <DeleteForeverIcon color="secondary"/>
                        </IconButton>
                    }
                </div>
            )
        });
        return metadataFields;
    }

    buildArticleObject = () => {
        // this.setState({loading:true})
        let metadata = {}
        this.state.metadata.forEach(([key, value]) => {
            metadata[key] = value;
        })
        let article = {
            authors: this.state.authors,
            metadata: metadata,
        }
        {Object.entries(this.state).forEach(([key,value])=>{
            if(typeof(value) === "string" && !["mandatoryFieldError", "metadataFieldError"].includes(key)){
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

        if(this.state.authors.some(author => author==="")){
            this.setState({mandatoryFieldError: "Author fields cannot be left empty!"})
            return false
        }
        if(this.state.metadata.some(field => field.includes(""))){
            this.setState({metadataFieldError: "Metadata fields cannot be left empty! "+
            "If you wish to not include the metadata field in the record, delete the field by clicking on the delete button."})
            return false
        }
        // if(this.state.title === ""){
        //     this.setState({mandatoryFieldError: "Title field cannot be left empty!"})
        //     return false
        // }
        // if(this.state.year === ""){
        //     this.setState({mandatoryFieldError: "Year field cannot be left empty!"})
        //     return false
        // }
        // if(this.state.url === ""){
        //     this.setState({mandatoryFieldError: "URL field cannot be left empty!"})
        //     return false
        // }
        let val = true
        Object.entries(this.state).map(([key,value])=>{
            if(value === "" && !["mandatoryFieldError", "metadataFieldError"].includes(key)){
                this.setState({mandatoryFieldError: `"${key}" field cannot be left empty!`})
                val = false
            }
        })
        return val
        // return true;
    }

    cancelEditing = () => {
        let {articleNumber,articles} = this.props;
        let article = articles[articleNumber]
        // Object.entries(article).map(([key,value])=>{
        //     if(typeof(value) === "string" && !["_id"].includes(key)){
        //         this.state[key] = value || ""
        //     }
        //     // console.log(`${key}: ${value} (${typeof(value)})`);
        // })

        Object.entries(article).map(([key,value])=>{
            if(typeof(value) === "string" && !["_id"].includes(key)){
                this.setState({[key]: value})
                // originalArticle = value || ""
            }
        })

        this.setState(()=>{
            return {
                article: {...article},
                authors: [...article.authors] || [],
                metadata: article.metadata ? Object.entries(article.metadata) : [],
                mandatoryFieldError: "",
                metadataFieldError: "",
                editable: false,
                articleIsEdited: false,
            }
        })
        // console.log("Author is: "+article.authors[0])
    }

    saveEdit = () => {
        let valid = this.validateFields()
        console.log(`valid: ${valid}`)
        if (valid){
            this.setState({editable: false, articleIsEdited: true})
        }
    }

    sendEditToServer = () => {
        if (!this.state.articleIsEdited) return this.props.handleClose()
        axios
            .put(`http://localhost:8080/article/put/${this.state.article._id}`, this.buildArticleObject())
            .then((res) => {
                console.log(res.data)
                console.log(res)
                this.props.updateArticle(this.props.articleNumber, res.data)
                this.props.handleClose()
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
                // this.setState({mandatoryFieldError: "Something went wrong!"})
            })
    }



    render() {
        const { classes } = this.props;
        return (
            <div className={classes.articleContainer}>
                <Typography variant="h4">Mandatory fields:</Typography>
                {/* <TextField label="Title" name="title" onChange={this.handleChange} value={this.state.title} className={classes.mandatoryField} InputProps={{readOnly: !this.state.editable}}/>
                <TextField label="Year" name="year" onChange={this.handleChange} value={this.state.year} className={classes.mandatoryField} InputProps={{readOnly: !this.state.editable}}/>
                <TextField label="URL" name="url"  onChange={this.handleChange} value={this.state.url} className={classes.mandatoryField} InputProps={{readOnly: !this.state.editable}}/> */}
                {Object.entries(this.state).map(([key,value])=>{
                    if(typeof(value) === "string" && !["mandatoryFieldError", "metadataFieldError"].includes(key)){
                        return(<TextField multiline={true} key={key} label={key} name={key} onChange={this.handleChange} value={this.state[key]} 
                            className={classes.mandatoryField} InputProps={{readOnly: !this.state.editable}}     
                        />)
                    }
                })}

                {this.state.authors &&
                    <div>
                        {this.renderAuthors()}
                        {this.state.editable &&
                            <IconButton  onClick={this.addAuthor}>
                                <AddCircleIcon color="secondary"/>
                            </IconButton>
                        }
                    </div> 
                }
                {(this.state.metadata.length !== 0 || this.state.editable) &&
                    <Typography variant="h4">Metadata fields:</Typography>
                }
                {this.state.metadata &&
                    <div>
                        {this.renderMetadata()}
                        {this.state.editable &&
                            <IconButton onClick={this.addMetadata}>
                                <AddCircleIcon color="secondary"/>
                            </IconButton>
                        }
                    </div> 
                }

                {this.state.mandatoryFieldError !== "" ?
                    <Alert className={classes.errorAlert} severity="error">{this.state.mandatoryFieldError}</Alert>
                : null}
                {this.state.metadataFieldError !== "" ?
                    <Alert className={classes.errorAlert} severity="error">{this.state.metadataFieldError}</Alert>
                : null}

                {/* <DialogActions> */}
                {this.state.editable ?
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        // backgroundColor:"blue",
                        marginTop: "30px",
                    }}>
                        <Button onClick={()=>{this.cancelEditing()}} variant="outlined" style={{marginRight:"15px"}} color="primary" >
                            Back to original
                        </Button>
                        <Button onClick={()=>{this.saveEdit()}} variant="contained" color="primary" autoFocus>
                            Save
                        </Button>
                    </div> :
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // backgroundColor:"blue",
                        marginTop: "30px",
                    }}>
                        <Button  variant="contained" onClick={()=>{this.setState({editable: true})}} color="primary" autoFocus>
                            Edit
                        </Button>
                        <div>
                            
                            <Button onClick={()=>{this.props.handleClose()}} style={{marginRight:"15px"}} variant="outlined" color="primary" autoFocus>
                                Cancel
                            </Button>
                            <Button onClick={()=>{this.sendEditToServer()}} variant="contained" color="primary" autoFocus>
                                Save
                            </Button>
                        </div>
                    </div> 
                }
            {/* </DialogActions> */}
            </div>
        )
    }
}
EditRecordDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EditRecordDialog);