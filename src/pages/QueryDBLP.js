import React, {Component} from "react";
import { Collapse, CircularProgress, FormLabel, 
    FormControlLabel, RadioGroup, Radio, Button, Container, 
    Typography, Paper, FormControl, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import ArticleCard from './ArticleCard';

const styles = theme => ({
    formCard: {
        backgroundColor: "#b2dfdb",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "550px",
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
        maxWidth: "550px",
        margin: "auto",
        marginTop:"40px",
        marginBottom: "20px",
    },
    searchContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "space-between",
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
})

const doneArticles = [
    {
        abstract: null,
        authors: ["Stefan Edelkamp", "Armin Weiß", "Sebastian Wild"],
        doi: "10.1007/S00453-019-00634-0",
        ee: "https://doi.org/10.1007/s00453-019-00634-0",
        key: "journals/algorithmica/EdelkampWW20",
        number: "3",
        pages: "509-588",
        title: "QuickXsort - A Fast Sorting Scheme in Theory and Practice.",
        type: "Journal Articles",
        url: "https://dblp.org/rec/journals/algorithmica/EdelkampWW20",
        venue: "Algorithmica",
        volume: "82",
        year: "2020",
    },
    {
        abstract: null,
        authors: ["Meng He 0001", "J. Ian Munro", "Yakov Nekrich", "Sebastian Wild", "Kaiyu Wu"],
        doi: null,
        ee: "https://arxiv.org/abs/2005.07644",
        key: "journals/corr/abs-2005-07644",
        number: null,
        pages: null,
        title: "Breadth-First Rank/Select in Succinct Trees and Distance Oracles for Interval Graphs.",
        type: "Informal Publications",
        url: "https://dblp.org/rec/journals/corr/abs-2005-07644",
        venue: "CoRR",
        volume: "abs/2005.07644",
        year: "2020",
    },
    {
        abstract: null,
        authors: ["Konstantinos Tsakalidis", "Sebastian Wild", "Viktor Zamaraev"],
        doi: null,
        ee: "https://arxiv.org/abs/2010.04108",
        key: "journals/corr/abs-2010-04108",
        number: null,
        pages: null,
        title: "Succinct Permutation Graphs.",
        type: "Informal Publications",
        url: "https://dblp.org/rec/journals/corr/abs-2010-04108",
        venue: "CoRR",
        volume: "abs/2010.04108",
        year: "2020",
    },
    {
        abstract: null,
        authors: ["Bryce Sandlund", "Sebastian Wild"],
        doi: null,
        ee: "https://arxiv.org/abs/2010.08840",
        key: "journals/corr/abs-2010-08840",
        number: null,
        pages: null,
        title: "Lazy Search Trees.",
        type: "Informal Publications",
        url: "https://dblp.org/rec/journals/corr/abs-2010-08840",
        venue: "CoRR",
        volume: "abs/2010.08840",
        year: "2020",
}]

class QueryDBLP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            type: "author",
            // articles: doneArticles,
            articles: [],
            collapseResults: true,
            errors: {},
            loading: false,
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
    handleSubmit = (event) => {
        event.preventDefault();
        console.log("submitting the form")
        if(this.state.searchTerm === ""){
            return this.setErrorMsg("searchTerm", "Required Field")
        }
        this.setState((prevState) => ({
            articles: [],
            errors: {
                ...prevState.errors,
                // ["searchResults"]: null,
            },
            loading: true,
            collapseResults: false,
        }))
        // setTimeout(()=>{
            axios
            .post("http://localhost:8080/query/dblp", {
                name: this.state.searchTerm,
                type: this.state.type,
                searchOwnRecord: false,
            })
            .then((res) => {
                console.log("Response:")
                console.log(res.status)
                console.log(res.data.dblpArticles)
                if(res.status === 200){
                    this.setState({
                        articles: res.data.dblpArticles,
                        loading: false,
                    });
                }
                
            })
            .catch((err) => {
                console.log(err)
                console.info(err.response)
                console.log(err.response.data.name)
                if(err.response.data.publication === "No articles for the given title" || err.response.data.author === "No articles for the given author"){
                    console.log("handle not found results")
                    this.setErrorMsg("searchResults", "No results for the given term were found! Check your spelling and make sure to capitalize appropriate letters.")
                }
                if(err.response.status === 500){
                    console.log("500 error")
                    this.setErrorMsg("searchResults", "Something went wrong! Please try again!")
                }
                this.setState({
                    loading: false,
                })
            });
        // }, 3000)
        // axios
        //     .post("http://localhost:8080/query/dblp", {
        //         name: this.state.searchTerm,
        //         type: this.state.type,
        //         searchOwnRecord: false,
        //     })
        //     .then((res) => {
        //         this.setState({collapseResults: true,})
        //         console.log("Response:")
        //         console.log(res.status)
        //         console.log(res.data.dblpArticles)
        //         if(res.status === 200){
        //             this.setState({
        //                 articles: res.data.dblpArticles,
        //                 loading: false,
        //             });
        //         }
                
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //         console.info(err.response)
        //         console.log(err.response.data.name)
        //         if(err.response.data.publication === "No articles for the given title" || err.response.data.author === "No articles for the given author"){
        //             console.log("handle not found results")
        //             this.setErrorMsg("searchResults", "No results for the given term were found!")
        //         }
        //         if(err.response.status === 500){
        //             console.log("500 error")
        //             this.setErrorMsg("searchResults", "Something went wrong! Check your spelling and try again!")
        //         }
        //         this.setState({
        //             collapseResults: true,
        //             loading: false,
        //         })
        //     });
    }

    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Query DBLP:</Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
                <form onSubmit={this.handleSubmit}  className={classes.formField}>
                <Typography variant="body2">
                    Choose between querying a researcher or a specific research paper.
                    Type in the name of the wanted entity and press on the "Search" button to be presented with results on the given entity.
                </Typography>
                
                <RadioGroup row aria-label="search-type" name="type" 
                    value={this.state.type} 
                    defaultValue="top"
                    onChange={this.handleChange}
                    // style={{backgroundColor:"red"}}
                    >
                    <FormLabel style={{alignSelf: "center", marginRight: "10px"}}>Searching for:</FormLabel>
                    <FormControlLabel value="author" control={<Radio color="primary" />} label="Author" />
                    <FormControlLabel value="publication" control={<Radio color="primary" />} label="Publication" />
                </RadioGroup>

                <FormControl error={this.state.errors.searchTerm ? true : false} className={classes.searchContainer}  >
                    {/* <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div> */}
                    <TextField
                        placeholder="Search…"
                        helperText={this.state.errors.searchTerm}
                        error={this.state.errors.searchTerm ? true : false}
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                        name="searchTerm"
                        inputProps={{ 'aria-label': 'search' }}
                        style={{
                            // marginRight: "auto",
                            width: "70%"
                        }}
                    />
                    
                    <Button disabled={this.state.loading} variant="contained" color="primary" onClick={this.handleSubmit} style={{marginRight: "0",
                        // marginLeft: "auto",
                        alignSelf: "flex-start",  
                        // marginRight: "0",
                        // height: "minContent"
                        }}>
                        <SearchIcon/> Search
                    </Button>
                    </FormControl>
                    <br/>
            </form>
            </Paper>
            <Collapse in={!this.state.collapseResults}>
                <Paper elevation={4} className={classes.resultsCard}>
                    {this.state.loading && 
                        <CircularProgress style={{
                          margin: "auto",  
                        }}/>
                    }
                    {this.state.articles !== [] &&
                        this.state.articles.map((article, index) => (
                            <ArticleCard name={"article_"+index} key={index} article={article}/>
                    ))}
                    
                    {this.state.articles.length === 0
                        && this.state.errors.searchResults
                        && <h2 style={{margin: "auto"}} >{this.state.errors.searchResults}</h2>
                    }
                </Paper>
            </Collapse>
        </div>
    )}

}

QueryDBLP.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(QueryDBLP);
