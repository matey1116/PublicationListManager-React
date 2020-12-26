import React, {Component} from "react";
import {InputLabel, Select, MenuItem, Checkbox, Collapse, CircularProgress, FormLabel,
    FormControlLabel, RadioGroup, Radio, Button, Container, 
    Typography, Paper, FormControl, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
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

class QueryDBLP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            type: "author",
            uuid: "",
            abstracts: false,
            articles: [],
            collapseResults: true,
            errors: {},
            loading: false,
            checkedCheckboxes: new Set([]),
            showSuccess: false,
            orderBy: "title",
            asc_desc: "asc",
            progress: 50,
            loadingType: "indeterminate",
        };    
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value,
            errors: {
                ...this.state.errors,
                [event.target.name]: null,
            },
        });
    };

    handleAbstractsChange = (event) => {
        const {name, checked} = event.target
        this.setState({
            [name]: checked,
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
                ["searchResults"]: null,
            },
            loading: true,
            collapseResults: false,
            checkedCheckboxes: new Set([]),
        }))
        axios
            .post("http://localhost:8080/query/dblp", {
                name: this.state.searchTerm,
                type: this.state.type,
                abstracts: this.state.abstracts,
                // searchOwnRecord: false,
                // liveFetch: true,
            })
            .then((res) => {
                if(res.status === 200){
                    console.log(res.data)
                    if(!this.state.abstracts){
                        this.setState({
                            articles: res.data.dblpArticles,
                            loading: false,
                        });
                    }
                    else{
                        this.setState({
                            uuid: res.data.uuid,
                            progress: 0,
                        })
                        setTimeout(() => { 
                            this.fetchArticles()
                        }, 1000)
                        
                    }
                } 
            })
            .catch((err) => {
                if(err.response.data.publication === "No articles for the given title" || err.response.data.author === "No articles for the given author"){
                    this.setErrorMsg("searchResults", "No results for the given term were found! Check your spelling and make sure to capitalize appropriate letters.")
                }
                if(err.response.status === 500){
                    this.setErrorMsg("searchResults", "Something went wrong! Please try again!")
                }
                this.setState({
                    loading: false,
                })
            });
    }

    fetchArticles = () => { 
            let checkProgress = setInterval(() => { 
                let errCounter = 0;
                axios
                    .get(`http://localhost:8080/query/status/${this.state.uuid}`)
                    .then((res) => {
                        if(res.status === 200){
                            if(res.data.progress || res.data.progress === 0){
                                this.setState({progress: res.data.progress})
                            }
                            if(res.data.response !== undefined && res.data.response.dblpArticles !== undefined){
                                clearInterval(checkProgress)
                                this.setState({
                                    articles: res.data.response.dblpArticles,
                                    loading: false,
                                });
                            }
                        } 
                    })
                    .catch((err) => {
                        console.log(err)
                        console.log(err.response)
                        if(!err.response || !err.response.data) return null
                        if(err.response.data.uuid === "Not Found"){
                            errCounter++;
                            if(errCounter >= 11){
                                this.setErrorMsg("searchResults", "Something went wrong! Please try again!")
                                this.setState({loading: false})
                                clearInterval(checkProgress)
                            }     
                        }
                        
                    });
                    }, 1000); 
    }

    toggleCheckbox = (event, index) => {
        // console.log(this.state.checkedCheckboxes)
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

    orderArticlesBy = (event) => {
        if(event){
            const {name, value} = event.target
            console.log("name, value: "+name+"  "+value)
            this.setState({[name]: value});
        }
        this.setState(({articles, orderBy, asc_desc})=>{
            // console.log("We want to order by: "+orderBy+" in "+asc_desc+" order")
            articles.sort(this.compareValues(orderBy, asc_desc))
            return {
                articles: articles,
            }
        })  
    } 

    compareValues = (key, order = 'asc') => {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
          }
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
    }

    render(){
        const { classes } = this.props;
        const orderByValues = ["title", "year",]
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
                    >
                    <FormLabel style={{alignSelf: "center", marginRight: "10px"}}>Searching for:</FormLabel>
                    <FormControlLabel value="author" control={<Radio color="primary" />} label="Author" />
                    <FormControlLabel value="publication" control={<Radio color="primary" />} label="Publication" />
                </RadioGroup>

                <Typography variant="body2">
                    For many of the publications, abstracts can be fetched as well, but it prolongs the query time.
                    It is recommended to fetch abstracts only in cases where not more than 50 articles are fetched. 
                </Typography>

                <FormControlLabel style={{marginRight: "auto"}} labelPlacement="start" 
                    label="Fetch abstracts" control={
                    <Checkbox
                        checked={this.state.abstracts}
                        onChange={this.handleAbstractsChange}
                        name="abstracts"
                        color="primary"
                    />}
                />

                <FormControl error={this.state.errors.searchTerm ? true : false} className={classes.searchContainer}  >
                    <TextField
                        placeholder="Search…"
                        helperText={this.state.errors.searchTerm}
                        error={this.state.errors.searchTerm ? true : false}
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                        name="searchTerm"
                        inputProps={{ 'aria-label': 'search' }}
                        style={{width: "70%"}}
                    />
                    
                    <Button disabled={this.state.loading} variant="contained" color="primary" onClick={this.handleSubmit} 
                        style={{
                            marginRight: "0",
                            alignSelf: "flex-start",  
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
                        <CircularProgress value={this.state.progress} variant="determinate" style={{margin: "auto",}}/>
                    }
                    {/* <CircularProgress value={this.state.progress} variant='determinate' style={{margin: "auto",}}/> */}
                    {this.state.articles.length > 0 && !this.state.loading && this.props.loggedIn &&
                        <Typography variant="h5" style={{marginBottom:"10px"}}>
                            If you wish to save any of the results, mark the checkbox next to the wanted record and click on the Save button.
                        </Typography>
                    }
                    
                    {this.state.articles.length !== 0 &&
                        <FormControl style={{marginTop:"40px", marginLeft:"10px", display: "flex", flexDirection: "row",alignItems:"baseline"}}>
                            <div>
                                <InputLabel id="demo-simple-select-label">Order by:</InputLabel>
                                <Select
                                    style={{minWidth: "90px", marginRight:"5px",}}
                                    name="orderBy"
                                    value={this.state.orderBy}
                                    onChange={this.orderArticlesBy}
                                >
                                    {orderByValues.map((name)=>(
                                        <MenuItem key={`${name}`} value={name}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                            {this.state.asc_desc === "asc" ? 
                                <ArrowUpwardIcon name="asc_desc" value="desc" onClick={()=>{
                                    this.setState({asc_desc: "desc"});
                                    this.orderArticlesBy()}}
                                />
                                :
                                <ArrowDownwardIcon name="asc_desc" value="asc" onClick={()=>{
                                    this.setState({asc_desc: "asc"});
                                    this.orderArticlesBy()}}
                                />
                            }
                        </FormControl>
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
            </Collapse>
        </div>
    )}

}

QueryDBLP.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(QueryDBLP);
