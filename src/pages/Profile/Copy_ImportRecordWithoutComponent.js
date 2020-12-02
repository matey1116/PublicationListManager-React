import React, {Component} from "react";
import { FormHelperText, TextareaAutosize, Collapse, CircularProgress, FormLabel, 
    IconButton, List, ListItemText, ListItem, Radio, Button, Container, 
    Typography, Paper, FormControl, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import EditableArticleCard from './EditableArticleCard';

const styles = theme => ({
    formCard: {
        backgroundColor: "#b2dfdb",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "800px",
        display: "flex",
        justifyContent: "center",
        [theme.breakpoints.down('xs')]: {
            padding: "30px 3px",
        },
    },
    formField: {
        width: "95%",
        marginTop: "7px",
        display: "flex",
        flexDirection: "column",
    },
    narrowField:{
        margin: "7px 15px",
        width: "235px"
    },
    textContainer: {
        maxWidth: "800px",
        margin: "auto",
        marginTop:"40px",
        marginBottom: "20px",
    },
    resultsCard: {
        backgroundColor: "#b2dfdb59",
        // color: "white",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "850px",
        display: "flex",
        justifyContent: "center",
        [theme.breakpoints.down('xs')]: {
            padding: "30px 3px",
        },
        marginTop: "40px",
        flexDirection: "column",
    },
    mandatoryField: {
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
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
})

class ImportRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bibtex: "",
            articles: [],
            collapseResults: true,
            errors: {},
            stage: 1,
            loading: false,
            showArticle: -1,
            article: {},
            title: "",
            year: "",
            url: "",
            authors: [],
            metadata: [],
        };   
        this.renderMetadata = this.renderMetadata.bind(this);
        
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            errors: {
                ...this.state.errors,
                [event.target.name]: null,
            }, 
        });
    };

    setErrorMsg = (fieldName, message) =>{   
        this.setState((prevState) => ({
            errors: {
                ...prevState.errors,
                [fieldName]: message,
            },
        }))
        return false;
    }

    stage1handleSubmit = (event) => {
        // event.preventDefault();
        console.log("submitting the form")
        if(this.state.bibtex === ""){
            return this.setErrorMsg("bibtex", "Required Field")
        }
        axios
            .post("http://localhost:8080/article/import", {
                stage: 1,
                bibtex: this.state.bibtex,
            })
            .then((res) => {                 
                if(res.data === "All articles from BiBTeX are already imported"){
                    return this.setErrorMsg("bibtex", "All articles from BiBTeX are already imported")
                }
                console.log("res.data")
                console.log(res.data)
                if(res.status === 200){
                    this.setState({
                        articles: res.data,
                        loading: false,
                        stage: 2,
                        showArticle: 0,
                        article: res.data[0],

                        title: res.data[0].title,
                        year: res.data[0].year,
                        url: res.data[0].url,
                        authors: res.data[0].authors,
                        metadata: Object.entries(res.data[0].metadata),
                    });
                }   
                    
            })
            .catch((err) => {
                console.log("ERR:")
                console.log(err.config)
                console.table(err)
                console.info(err.response)
                this.setState({
                    loading: false,
                })
            });
    }
    
    stage2handleSubmit = (event) => {
        // event.preventDefault();
        console.log("\n\n\n\n\nsubmitting the form")
        // this.setState({
        //     loading: true,
        // })  
        console.log(this.updateArticlesMetadata())
        // axios
        //     .post("http://localhost:8080/article/import", {
        //         stage: 2,
        //         editedImportDataList: this.updateArticlesMetadata(),
        //     })
        //     .then((res) => {                 
        //         console.log("Response:")
        //         console.log(res.data)    
        //         this.setState({
        //             loading: false,
        //         })        
        //     })
        //     .catch((err) => {
        //         console.log("ERR:")
        //         console.table(err)
        //         console.info(err.response)
        //         this.setState({
        //             loading: false,
        //         })
        //     });
    
    }

    previousNextArticle = (number, article) => {
        console.log(`current showArticle value = ${this.state.showArticle}, while future value is ${number}`)
         this.setState((prevState)=>{
            console.log("\n\n\nArticle submitted: ")
            console.log(prevState.article)
            prevState.article = article
            prevState.articles[this.state.showArticle] = article
            return { 
                articles: prevState.articles,
                article: prevState.articles[number],
                showArticle: number,
            }
        })
        console.log("Updated articles")
        console.log(this.state.articles)
        console.log("Newly chosen article")
        console.log(this.state.article)

                    
        // this.setState(({articles})=>{
            // console.log("\n\n\nArticle submitted: ")
            // console.log(article)
            // articles[this.state.showArticle] = article
            // return { articles: articles }
        // })
        // this.setState({showArticle: number})   
        // this.forceUpdate();
        
        // switch(operation){
        //     case "next":
                // this.setState(prevState => {
                //     return {showArticle: prevState.showArticle + number}
                //  })
                // break;
            // case "previous":
                // this.setState(prevState => {
                    // return {showArticle: prevState.showArticle - 1}
                //  })
                // break;
        // }
    }




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
            metadata: prevState.metadata.filter((_, i) => i != index)
        }));
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

    renderArticle = () => {
        const { classes } = this.props;

        console.log("rendering Article " + this.state.showArticle )
        // this.forceUpdate();
        
        return (
            <div className={classes.articleContainer}>
                <TextField label="title" name="title" onChange={this.handleChange} value={this.state.title} className={classes.mandatoryField}/>
                <TextField label="year" name="year" onChange={this.handleChange} value={this.state.year} className={classes.mandatoryField}/>
                <TextField label="url" name="url"  onChange={this.handleChange} value={this.state.url} className={classes.mandatoryField}/>
                {this.state.authors ? 
                    <div>
                        {this.renderAuthors()}
                        <IconButton  onClick={this.addAuthor}>
                            <AddCircleIcon color="secondary"/>
                        </IconButton>
                    </div> 
                    : null
                }
                {this.state.metadata ? 
                    <div>
                        {this.renderMetadata()}
                        <IconButton onClick={this.addMetadata}>
                            <AddCircleIcon  onClick={this.addMetadata} color="secondary"/>
                        </IconButton>
                    </div> 
                    : null
                }
                {this.state.showArticle !== 0 && (
                    <Button variant="contained" color="primary"  style={{
                        marginRight: "0",
                        // marginLeft: "auto",
                        alignSelf: "flex-start",  
                        marginTop: "3px",
                        // height: "minContent"
                    }}
                    // , this.buildArticleObject() 
                    onClick=
                    {()=>{
                        this.previousNextArticle(this.state.showArticle-1, this.buildArticleObject())
                    }} 
                    >
                        Previous
                    </Button>
                )}

                {this.state.showArticle+1 < this.state.articles.length && (
                    <Button variant="contained" color="primary"  style={{
                        marginRight: "0",
                        // marginLeft: "auto",
                        alignSelf: "flex-start",  
                        marginTop: "3px",
                        // height: "minContent"
                    }}
                    onClick=
                    {()=>{
                        this.previousNextArticle(this.state.showArticle+1, this.buildArticleObject())
                    }}>
                        Next
                    </Button>
                )}
                <Button variant="contained" color="primary"  style={{
                        marginRight: "0",
                        // marginLeft: "auto",
                        alignSelf: "flex-start",  
                        marginTop: "3px",
                        // height: "minContent"
                    }}
                    onClick=
                    {()=>{
                        this.previousNextArticle(1, this.buildArticleObject())
                    }}>
                        Change to article 2 (with index 1)
                    </Button>
            </div>
        )
    }


    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Import a record:</Typography>
                Title of current article: {this.state.article.title}
            </Container>
            <Paper elevation={7} className={classes.formCard}>
                
                {(this.state.stage === 1) &&
                    <div style={{
                        width:"100%",
                        display:"flex",
                        flexDirection: "column",
                    }}>
                        {/* <form onSubmit={this.handleSubmit}  className={classes.formField}> */}
                            <Typography variant="body2">
                                Paste your BibTeX text into the input field below.
                            </Typography>
                            <FormControl error={this.state.errors.bibtex ? true : false} className={classes.searchContainer}  >
                                <TextareaAutosize rowsMin={3} name="bibtex" onChange={this.handleChange} value={this.state.bibtex} aria-label="empty textarea" 
                                    placeholder="BibTex" style={{borderColor: (this.state.errors.bibtex && "red"), maxWidth: "100%",}}/>
                                <FormHelperText id="component-helper-text">{ this.state.errors.bibtex }</FormHelperText>
                            </FormControl>
                            <Button disabled={this.state.loading} variant="contained" color="primary" onClick={this.stage1handleSubmit} style={{
                                marginRight: "0",
                                // marginLeft: "auto",
                                alignSelf: "flex-start",  
                                marginTop: "3px",
                            }}>
                                Parse BibTeX
                            </Button>
                        {/* </form> */}
                    </div>
                }
                {this.state.articles.map((article, index)=>{
                    if(index === this.state.showArticle){
                        return (
                        <EditableArticleCard 
                            // articles={this.state.articles}
                            numOfArticles={this.state.articles.length}
                            previousNextArticle={this.previousNextArticle} 
                            articleNumber={index}
                            article={article}
                        /> 
                    )}
                })}
                {/* {(this.state.stage !== 1) && (this.state.articles.length !== 0) && */}
                {/* {(this.state.showArticle !== -1) ? this.renderArticle(this.state.showArticle) : null}  */}
                               
                        
                {/* } */}
                {/* this.renderArticle(this.state.showArticle) */}
            </Paper>
        </div>
    )}
}

ImportRecord.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(ImportRecord);