import React, {Component} from "react";
import { FormHelperText, TextareaAutosize, Collapse, CircularProgress, FormLabel, 
    List, ListItemText, ListItem, Radio, Button, Container, 
    Typography, Paper, FormControl, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

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
    searchContainer: {
        margin:"7px 0",
        // display: "flex",
        // flexDirection: "row",
        // flexWrap: "wrap",
        // width: "100%",
        // justifyContent: "space-between",
        // backgroundColor: "blue",
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
})

class ImportRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // bibtex: "",
            bibtex: "",
            articles: [],
            collapseResults: true,
            errors: {},
            stage: 1,
            loading: false,
            showArticle: -1,
            article: {}
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

    handleMandatoryFieldChange = (event,articleIndex) => {
        let {name,value} = event.target;
        this.setState(({articles}) => {
            articles[articleIndex][name] = value;
            return {
                articles: articles,
                // errors: {
                    // ...this.state.errors,
                    // [event.target.name]: null,
                // },
            }
        });
    };

    handleFieldUpdate = (event, articleIndex, fieldIndex, index) => {
        // console.log(event+"\n"+articleIndex+"\n"+fieldIndex+"\n"+index+"\n\n\n");
        // console.log(`[event.target.name]: event.target.value,`)
        // console.log(`${[event.target.name]}: ${event.target.value}\n\n\n`)
        let newValue = event.target.value
        this.setState(({metadatas}) => {
            console.log("this is prev metadatas")
            console.log(metadatas)
            metadatas[articleIndex][fieldIndex][index] = newValue
            // [event.target.name]: event.target.value,
            return {
                metadatas: metadatas,
                // errors: {
                    // ...this.state.errors,
                    // [event.target.name]: null,
                // },
            }
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
                        article: res.data[0]
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
    
    updateArticlesMetadata = () => {
        for (let i = 0; i < this.state.metadatas.length; i++){
            let metadata = {}
            console.log("Merging metadata for article "+i)
            this.state.metadatas[i].forEach(([key, value], fieldIndex) => {
                console.log(`${key}: ${value} CIMMMI`);
                metadata[key] = value;
            })
            this.setState(({articles})=>{
                articles[i].metadata = metadata
                return{
                    articles: articles
                }
            })
        }
        

        
        return this.state.articles
        // console.log("articles after")
        // console.log(this.state.articles)
    }

    renderMetadata = (articleIndex) => {
        let metadataFields = [];
        this.state.metadatas[articleIndex].forEach(([key, value], fieldIndex) => {
            metadataFields.push(
                <div style={{   
                    display:"flex",
                    width: "100%",
                    margin:"7px 0",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    justifyContent: 'space-between',
                    // backgroundColor: "blue",
                }} key={`A_${articleIndex}_F_${fieldIndex}`}>
                    <TextField
                        multiline = {true}
                        name={`metadatas[${articleIndex}][${fieldIndex}][0]`}
                        value={this.state.metadatas[articleIndex][fieldIndex][0]}
                        onChange={(e)=>{this.handleFieldUpdate(e, articleIndex, fieldIndex, 0)}}
                        style={{
                            width: "30%",
                            alignSelf: "flex-start"
                        }} />
                    <TextField 
                        multiline = {true}
                        name={`metadatas[${articleIndex}][${fieldIndex}][1]`}
                        value={this.state.metadatas[articleIndex][fieldIndex][1]}
                        onChange={(e)=>{this.handleFieldUpdate(e, articleIndex, fieldIndex, 1)}}
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

    renderAuthorsField = (articleIndex) => {
        console.log("this.state.authors[articleIndex]")
        console.log(this.state.authors[articleIndex])
        let authorFields = [];
        this.state.authors[articleIndex].forEach((author, fieldIndex) => {
            console.log("fieldIndex: "+fieldIndex)
            authorFields.push(
                // <div style={{backgroundColor: "red"}}>
                    <TextField style={{
                        // marginTop:"50px"
                    }} label={`Author ${fieldIndex+1}`} name={`authors[${articleIndex}][${fieldIndex}]`} value={this.state.authors[articleIndex][fieldIndex]}/>
                // </div>
            )
        })
        return authorFields
    }

    renderMandatoryData = (articleIndex) => {
        const { classes } = this.props;

        // console.log("Titttttle: "+this.state["[articles][0][title]"])
        return (
            <div style={{   
                display:"flex",
                width: "100%",
                margin:"7px 0",
                flexDirection: "column",
                // alignItems: "flex-start",
                flexWrap: "wrap",
                // justifyContent: 'space-between',
                // backgroundColor: "blue",
            }}>
                {this.state.articles[articleIndex].title !== undefined && 
                    <div style={{   
                        display:"flex",
                        width: "100%",
                        margin:"7px 0",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        justifyContent: 'space-between',
                        // backgroundColor: "blue",
                    }}>
                        <TextField 
                            multiline = {true}
                            name= "title"
                            label= "Title"
                            value={this.state.articles[articleIndex].title}
                            onChange={(e)=>{this.handleMandatoryFieldChange(e, articleIndex)}}
                            style={{
                                width: "100%",
                                alignSelf: "center",
                                backgroundColor:"#b2dfdb",
                            }} />
                    </div>
                }
                {/* <h3>{article.title}</h3> */}
                {this.state.articles[articleIndex].authors && <div><strong>Authors:</strong> {this.state.articles[articleIndex].authors.join(", ")}</div>}
                <div className={classes.mandatoryField}>
                    {this.renderAuthorsField(articleIndex)}
                </div>
                {this.state.articles[articleIndex].year !== undefined && 
                    <div style={{   
                        display:"flex",
                        width: "100%",
                        margin:"7px 0",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        justifyContent: 'space-between',
                        // backgroundColor: "blue",
                    }}>
                        <TextField 
                            name= "year"
                            label= "Year"
                            value={this.state.articles[articleIndex].year}
                            onChange={(e)=>{this.handleMandatoryFieldChange(e, articleIndex)}}
                            style={{
                                width: "100%",
                                alignSelf: "center",
                                backgroundColor:"#b2dfdb",
                            }} />
                    </div>
                }
                {/* {this.state.articles[articleIndex].year && <div><strong>Year:</strong> {this.state.articles[articleIndex].year}</div>} */}
                {this.state.articles[articleIndex].doi && <div><strong>DOI:</strong> {this.state.articles[articleIndex].doi}</div>}
                {this.state.articles[articleIndex].url !== undefined && 
                    <div style={{   
                        display:"flex",
                        width: "100%",
                        margin:"7px 0",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        justifyContent: 'space-between',
                        // backgroundColor: "blue",
                    }}>
                        <TextField 
                            name= "url"
                            label= "URL"
                            value={this.state.articles[articleIndex].url}
                            onChange={(e)=>{this.handleMandatoryFieldChange(e, articleIndex)}}
                            style={{
                                width: "100%",
                                alignSelf: "center",
                                backgroundColor:"#b2dfdb",
                            }} />
                    </div>
                }
                {/* {this.state.articles[articleIndex].url && <div><strong>URL:</strong> {this.state.articles[articleIndex].url}</div>} */}
        </div>
        )
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

    renderArticle = () => {
        console.log("rendering Article " + this.state.showArticle )
        // this.forceUpdate();
        
        return (
            <EditableArticleCard 
                // articles={this.state.articles}
                numOfArticles={this.state.articles.length}
                previousNextArticle={this.previousNextArticle} 
                articleNumber={this.state.showArticle} 
                article={this.state.article}
            />  
        )
    }


    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Import a record:</Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
                {this.state.showArticle}
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

                {/* {(this.state.stage !== 1) && (this.state.articles.length !== 0) && */}
                {(this.state.showArticle !== -1) ? this.renderArticle(this.state.showArticle) 

                
                 : null} 
                               
                        
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