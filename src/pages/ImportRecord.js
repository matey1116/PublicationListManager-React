import React, {Component} from "react";
import { FormHelperText, TextareaAutosize,
    Button, Container, Typography, Paper, FormControl
    } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
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
    successContainer: {
        maxWidth: "650px",
        margin: "30px auto"
    },
})

class ImportRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 5,
            bibtex: "",
            articles: [],
            collapseResults: true,
            errors: {},
            stage: 1,
            loading: false,
            showArticle: -1,
            article: {}
        };       
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
                console.log(res.data)           
                if(res.data === "All articles from BiBTeX are already imported"){
                    return this.setErrorMsg("bibtex", "All the articles provided have already been imported!")
                }
                if(res.status === 200 && res.data.length===0){
                    return this.setErrorMsg("bibtex", "All the articles provided have already been imported!")
                }
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
    
    stage2handleSubmit = (article) => {
        console.log("\n\n\n\n\nsubmitting the form 2")
        this.setState((prevState)=>{
            prevState.article = article
            prevState.articles[this.state.showArticle] = article
            return { 
                articles: prevState.articles,
                article: article,
                loading: true,
            }
        })
        console.log("About to submit articles:")
        console.log(this.state.articles)

        axios
            .post("http://localhost:8080/article/import", {
                stage: 2,
                editedImportDataList: this.state.articles,
            })
            .then((res) => {                 
                console.log("Response:")
                console.log(res.data)    
                console.log(res)    
                this.setState({
                    loading: false,
                })  
                this.showSuccess()   
            })
            .catch((err) => {
                console.log("ERR:")
                console.table(err)
                console.info(err.response)
                this.setState({
                    loading: false,
                })
            });
    
    }


    previousNextArticle = (number, article) => {
        // console.log(`current showArticle value = ${this.state.showArticle}, while future value is ${number}`)
        this.setState((prevState)=>{
            prevState.article = article
            prevState.articles[this.state.showArticle] = article
            return { 
                articles: prevState.articles,
                article: prevState.articles[number],
                showArticle: number,
            }
        })
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

    deleteArticle = () => {

    }


    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Import records from BibTeX</Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
                {(this.state.stage === 1) &&
                    <div style={{
                        width:"100%",
                        display:"flex",
                        flexDirection: "column",
                    }}>
                        {/* <form onSubmit={this.handleSubmit}  className={classes.formField}> */}
                            <Typography variant="h5">
                                Paste your BibTeX text into the input field below.
                            </Typography>
                            <Typography variant="body1">Fields "<strong>title</strong>", "<strong>year</strong>", and "<strong>authors</strong>" are mandatory for a successful BibTex parsing.</Typography>
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

                {(this.state.stage === 2) && this.state.articles.map((article, index)=>{
                    if(index === this.state.showArticle){
                        return (
                        <EditableArticleCard 
                            key={`A_${index}`}
                            numOfArticles={this.state.articles.length}
                            previousNextArticle={this.previousNextArticle} 
                            articleNumber={index}
                            article={article}
                            submitArticles={this.stage2handleSubmit}
                            deleteArticle={this.deleteArticle}
                        /> 
                    )}
                })}
                {this.state.stage === 3 && 
                    <Container className={classes.successContainer}>
                        <Alert variant="filled" severity="success">
                            <AlertTitle>Success!</AlertTitle>
                            The BibTeX records have been successfully added! You will be redirected to the Records page in <strong>{this.state.timer}</strong>
                        </Alert>
                    </Container>
                }
            </Paper>
        </div>
    )}
}



ImportRecord.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(ImportRecord);