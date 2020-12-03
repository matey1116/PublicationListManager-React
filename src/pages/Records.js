import React, {Component} from "react";
import { Dialog, IconButton, Checkbox, FormHelperText, TextareaAutosize,
    Button, Container, Typography, Paper, FormControl, Collapse
    } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import ExportWindow from './ExportWindow';
import ArticleCard from './ArticleCard';

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
    submit_shareButtons: {
        margin: "10px 30px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },  

    articleContainer: {
        margin: "10px 0",
        padding: "10px 10px",
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px #b5dfdcc9',

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        // backgroundColor:"red",
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
    successContainer: {
        maxWidth: "650px",
        margin: "30px auto"
    },
})

class Records extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            errors: {},
            loading: false,
            showCheckboxes: false,
            // checkedCheckboxes: {},
            checkedCheckboxes: new Set([]),
            action: "default",
            errorText: "",
            readyToSubmit: false,
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

    componentDidMount(){
        this.setState({loading: true})
        axios
            .get("http://localhost:8080/article/get")
            .then((res) => {
                console.log(res.data)
                this.setState({
                    articles: res.data,
                    loading: false,
                })
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
            })
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
                return this.props.history.push('/profile')
            }
            this.setState((prevState)=>({
                timer: prevState.timer-1,
            }));
        }, 1000)
    }

    toggleCheckbox = (event, article_id) => {
        console.log(this.state.checkedCheckboxes)
        if(event.target.checked){
            return this.setState(({checkedCheckboxes}) => {
                return {
                    checkedCheckboxes: checkedCheckboxes.add(article_id),
                }
            })
        }
        this.setState(({checkedCheckboxes}) => {
            checkedCheckboxes.delete(article_id)
            return {
                checkedCheckboxes: checkedCheckboxes,
            }
        })
    }

    showCheckboxes = (action) => {
        this.setState({
            showCheckboxes: true,
            action: action
        })
    }

    submitChosenArticles = () => {
        console.log("Submitting articles")
        console.log(this.state.checkedCheckboxes)
        if (this.state.checkedCheckboxes.size === 0){
            return this.setState({errorText: "No articles were chosen!"})
        }
        this.setState({
            errorText: "",
            readyToSubmit: true,
        })

    }

    handleClose = () => {
        this.setState({readyToSubmit: false})
    };

    getChosenArticles = () => {
        let chosenArticles = []
        let articleTypes = {}
        this.state.checkedCheckboxes.forEach(articleIndex => {
            chosenArticles.push(this.state.articles[articleIndex])
            let id = this.state.articles[articleIndex]._id
            articleTypes[id] = ""
        });
        return {chosenArticles: chosenArticles, articleTypes: articleTypes}    
    }

    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Records: </Typography>
            </Container>

            <Dialog open={this.state.readyToSubmit}>
                {this.state.action === "export" ?
                    <ExportWindow data={this.getChosenArticles()} handleClose={()=>{this.handleClose()}}/> :
                    <h1>Sharing articles</h1>
                }
            </Dialog>

            <Paper elevation={7} className={classes.formCard}>
                <h2>{this.state.errorText}</h2>
                <Typography variant="body1">
                    Browse through your records, or choose between exporting or sharing them by clicking on the buttons below.
                </Typography>
                {/* <Collapse in={!this.state.showCheckboxes} component="div"> */}
                {this.state.articles !== [] && 
                    <div>    
                        <Button name="share" disabled={this.state.showCheckboxes} className={classes.submit_shareButtons} onClick={()=>{this.showCheckboxes("share")}} color="primary" variant="contained">Share</Button>
                        <Button name="export" disabled={this.state.showCheckboxes} className={classes.submit_shareButtons} onClick={()=>{this.showCheckboxes("export")}} color="primary" variant="contained">Export</Button>
                    </div>  
                }
                <Collapse in={this.state.errorText !== ""}>
                    <Alert severity="error" action={
                        <IconButton size="small" onClick={() => {this.setState({errorText: ""});}}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        }
                    >
                    {this.state.errorText}
                    </Alert>
                </Collapse>

                <Collapse in={this.state.showCheckboxes} component="div">
                    <Typography variant="body1">
                        Choose the records you would like to {this.state.action}.
                    </Typography>  
                    <Button className={classes.submit_shareButtons} color="primary" variant="contained"
                        onClick={()=>{this.setState({
                            showCheckboxes: false,
                            checkedCheckboxes: new Set([]),
                            errorText: "",
                    })}}>
                        Cancel
                    </Button>
                    <Button className={classes.submit_shareButtons} onClick={()=>{this.submitChosenArticles()}} color="primary" variant="contained">{this.state.action}</Button>
                </Collapse>
            {/* <div className={classes.articleContainer}> */}
                {this.state.articles !== [] &&
                    this.state.articles.map((article, index) => {
                        return(
                            <div className={classes.articleContainer} key={index}>
                                <ArticleCard name={"article_"+index} noStyle={true}
                                    style={{maxWidth: "90%",}} key={index} article={{
                                        title: article.title,
                                        authors: article.authors,
                                        year: article.year,
                                        doi: article.metadata.DOI || article.metadata.doi,
                                    }}
                                />
                                <Collapse in={this.state.showCheckboxes}>
                                    <Checkbox onChange={(e)=>{this.toggleCheckbox(e, index)}}
                                        checked={this.state.checkedCheckboxes.has(index)}
                                        style={{height: "min-content"}}
                                    />
                                </Collapse>
                            </div>
                            
                        )
                    })
                }
                
            </Paper>
        </div>
    )}
}



Records.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(Records);