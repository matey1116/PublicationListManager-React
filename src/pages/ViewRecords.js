import React, {Component} from "react";
import { Dialog, IconButton, Container, Typography, Paper, Collapse} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import ArticleCard from './ArticleCard';
import DeleteRecordDialog from './DeleteRecordDialog';
import EditRecordDialog from './EditRecordDialog';

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
    },
    textContainer: {
        maxWidth: "800px",
        margin: "auto",
        marginTop:"40px",
        marginBottom: "20px",
    },
})

class ViewRecords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            errors: {},
            loading: false,
            articleIndex: undefined,
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

    toggleCheckbox = (event, article_id) => {
        console.log(this.state.checkedCheckboxes)
        if(event.target.checked){
            return this.setState(({checkedCheckboxes}) => {
                return {
                    checkedCheckboxes: checkedCheckboxes.add(article_id),
                }
            })
        }
        else{
            this.setState(({checkedCheckboxes}) => {
                checkedCheckboxes.delete(article_id)
                return {
                    checkedCheckboxes: checkedCheckboxes,
                }
            })
        }
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

    updateArticle = (index, article) => {
        this.setState(({articles})=>{
            articles[index] = article
            return {
                articles: articles
            }
        })
    };

    getChosenArticles = () => {
        let chosenArticles = []
        let articleTypes = {}
        this.state.checkedCheckboxes.forEach(articleIndex => {
            chosenArticles.push(this.state.articles[articleIndex])
            let id = this.state.articles[articleIndex]._id
            articleTypes[id] = "article"
        });
        return {articles: chosenArticles, articleTypes: articleTypes}    
    }

    getListChosenArticles = () => {
        let chosenArticles = []
        this.state.checkedCheckboxes.forEach(articleIndex => {
            chosenArticles.push(this.state.articles[articleIndex]._id)
        });
        console.log("sharing articles")
        console.log(chosenArticles)
        return chosenArticles
    }

    handleClick = (articleIndex, action) => {
        console.log(`About to ${action} article at index ${articleIndex}`)
        this.setState({
            action: action,
            articleIndex: articleIndex,
            readyToSubmit: true,
        })
    }

    removeArticle = (index) => {
        console.log("removing article "+index)
        let copy = [... this.state.articles]
        copy.splice(index, 1);
        this.setState({articles: copy})
    }

    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">View/Edit Records: </Typography>
            </Container>

            <Dialog maxWidth='lg' scroll="paper" onEscapeKeyDown={this.handleClose} open={this.state.readyToSubmit}>
                {this.state.action === "delete" ?
                    <DeleteRecordDialog removeArticle={(index)=>{this.removeArticle(index)}} articles={this.state.articles} articleIndex={this.state.articleIndex} handleClose={()=>{this.handleClose()}}/> :
                    
                    <EditRecordDialog 
                        removeArticle={(index)=>{this.removeArticle(index)}}
                        articles={this.state.articles} 
                        articleNumber={this.state.articleIndex} 
                        handleClose={()=>{this.handleClose()}}
                        updateArticle={(index,article)=>{this.updateArticle(index,article)}}
                    /> 
                }
            </Dialog>

            <Paper elevation={7} className={classes.formCard}>
                
                <h2>{this.state.errorText}</h2>
                <Typography variant="h6">
                    Browse through your records and edit or delete them.
                </Typography>
                {/* <Collapse in={!this.state.showCheckboxes} component="div"> */}
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
            {/* <div className={classes.articleContainer}> */}
                {this.state.articles !== [] &&
                    this.state.articles.map((article, index) => {
                        return(
                            <div className={classes.articleContainer} key={index}>
                                <ArticleCard name={"article_"+index} noStyle={true}
                                    style={{width: "100%",}} key={index} article={{
                                        title: article.title,
                                        authors: article.authors,
                                        year: article.year,
                                        abstract: article.abstract,
                                        doi: article.metadata ? article.metadata.doi || article.metadata.DOI || null : null,
                                    }}
                                />
                                <IconButton onClick={()=>{this.handleClick(index,"edit")}}>
                                    <EditIcon fontSize="large" color="primary" />
                                </IconButton>
                                <IconButton onClick={()=>{this.handleClick(index,"delete")}}>
                                    <DeleteIcon fontSize="large" color="primary" />
                                </IconButton>
                            </div>       
                        )
                    })
                }
                
            </Paper>
        </div>
    )}
}



ViewRecords.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(ViewRecords);