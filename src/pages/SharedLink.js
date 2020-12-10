import React, {Component} from "react";
import {Checkbox, CircularProgress, Button, Container, Typography, Paper } from "@material-ui/core";
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import ArticleCard from './ArticleCard';

const styles = theme => ({
    textContainer: {
        maxWidth: "850px",
        margin: "auto",
        marginTop:"40px",
        marginBottom: "20px",
    },
    resultsCard: {
        backgroundColor: "#b2dfdb59",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "850px",
        display: "flex",
        justifyContent: "center",
        [theme.breakpoints.down('xs')]: {
            padding: "30px 3px",
        },
        flexDirection: "column",
    },
})

class SharedLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            errors: {},
            loading: false,
            checkedCheckboxes: new Set([]),
            showSuccess: false,
            uuid: props.match.params.id,
        };    
    }

    componentDidMount(){
        this.setState({loading: true})
        axios
            .get(`http://localhost:8080/share/${this.state.uuid}`)
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
                if(err.response.data.id){
                    this.setErrorMsg("searchResults", "The share link is not valid!")
                }
                if(err.response.status === 500){
                    this.setErrorMsg("searchResults", "Something went wrong! Please try again!")
                }
                this.setState({loading: false,})
            })
    }

    setErrorMsg = (fieldName, message) =>{   
        this.setState((prevState) => ({
            errors: {
                ...prevState.errors,
                [fieldName]: message,
            },
        }))
        return false;
    }

    toggleCheckbox = (event, index) => {
        console.log(this.state.checkedCheckboxes)
        if(event.target.checked){
            return this.setState(({checkedCheckboxes}) => {
                return {
                    checkedCheckboxes: checkedCheckboxes.add(index),
                }
            })
        }
        else{
            this.setState(({checkedCheckboxes}) => {
                checkedCheckboxes.delete(index)
                return {
                    checkedCheckboxes: checkedCheckboxes,
                }
            })
        }
    }
    
    saveRecords = () => {
        console.log("saving records")
        axios
            .post("http://localhost:8080/query/dblp/save", {
                dblpArticles: this.getChosenArticles()
            })
            .then((res) => {
                console.log(res)
                console.log(res.data)
                this.setState({
                    articles: [],
                    showSuccess: true,
                })
                this.setErrorMsg("searchResults", "Records have been successfully saved!")
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
            })
    }

    getChosenArticles = () => {
        let chosenArticles = []
        this.state.checkedCheckboxes.forEach(articleIndex => {
            chosenArticles.push(this.state.articles[articleIndex])
        });
        return chosenArticles
    }

    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Shared articles:</Typography>
            </Container>
                <Paper elevation={4} className={classes.resultsCard}>
                    {this.state.loading && 
                        <CircularProgress style={{margin: "auto",}}/>
                    }

                    {this.state.articles.length > 0 && !this.state.loading && this.props.loggedIn &&
                        <Typography variant="h5" style={{marginBottom:"10px"}}>
                            These articles have been shared. If you wish to save them to your own profile, 
                            make sure to be logged in and then toggle the checkboxes next to the wanted articles
                            and click the Save button.
                        </Typography>
                    }

                    {this.state.articles !== [] &&
                        this.state.articles.map((article, index) => (
                            <div key={index} style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <ArticleCard name={"article_"+index} key={index} article={article} style={{
                                    width: "100%",
                                }}/>
                                
                                {this.props.loggedIn ?
                                    <Checkbox 
                                        onChange={(e)=>{this.toggleCheckbox(e, index)}}
                                        checked={this.state.checkedCheckboxes.has(index)}
                                        style={{height: "min-content"}}
                                    /> : null
                                }
                                
                            </div>
                    ))}
                    
                    {this.state.articles.length !== 0 && this.props.loggedIn &&
                        <Button disabled={this.state.checkedCheckboxes.size === 0 || this.state.loading} color="primary" variant="contained" 
                        onClick={()=>{this.saveRecords()}} 
                            style={{
                                width:"max-content",
                                marginLeft:"auto",
                                marginRight: "5%",
                                marginTop: "30px",
                            }}>
                            Save
                        </Button>
                    }

                    {this.state.articles.length === 0
                        && this.state.errors.searchResults
                        && <h2 style={{margin: "auto"}} >{this.state.errors.searchResults}</h2>
                    }
                </Paper>
        </div>
    )}

}

SharedLink.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(SharedLink);