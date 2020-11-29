import React, {Component} from "react";
import { FormHelperText, TextareaAutosize, Collapse, CircularProgress, FormLabel, 
    FormControlLabel, RadioGroup, Radio, Button, Container, 
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

class ImportRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // bibtex: "",
            bibtex: `
                @article{Edelkamp2019,
                doi = {10.1007/s00453-019-00634-0},
                url = {https://doi.org/10.1007/s00453-019-00634-0},
                year = {2019},
                month = oct,
                publisher = {Springer Science and Business Media {LLC}},
                volume = {82},
                number = {3},
                pages = {509--588},
                author = {Stefan Edelkamp and Armin Wei{\ss} and Sebastian Wild},
                title = {{QuickXsort}: A Fast Sorting Scheme in Theory and Practice},
                journal = {Algorithmica}
            }`,
            articles: [],
            collapseResults: true,
            errors: {},
            stage: 1,
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
        if(this.state.bibtex === ""){
            return this.setErrorMsg("bibtex", "Required Field")
        }
        // this.setState((prevState) => ({
            // articles: [],
            // errors: {
            //     ...prevState.errors,
                // ["searchResults"]: null,
        //     },
        //     loading: true,
        //     collapseResults: false,
        // }))
        // setTimeout(()=>{
            axios
                .post("http://localhost:8080/article/import", {
                    stage: 1,
                    // bibtex: "this.state.bibtex",
                    bibtex: this.state.bibtex,
                })
                .then((res) => {
                    // [
                    //     {
                    //         title: “”,
                    //         authors: [“”, “”,””],
                    //         year: “”,
                    //         doi: ””,
                    //         url: “”, (link to full article)
                    //         metadata:{}
                    //     }
                    //     , etc
                    //     ]
                        
                    console.log("Response:")
                    console.log(res.data[0])
                    console.log("Metadata:")
                    console.log(res.data[0].metadata)
                    if(res.status === 200){
                        this.setState({
                            articles: res.data,
                            loading: false,
                            stage: 2,
                        });
                    }     
                })
                .catch((err) => {
                    console.log("ERR:")
                    console.log(err.config)
                    console.table(err)
                    console.info(err.response)
                    // console.info(err.response.data)
                    // console.log(err.response.data.name)
                    // if(err.response.data.publication === "No articles for the given title" || err.response.data.author === "No articles for the given author"){
                    //     console.log("handle not found results")
                    //     this.setErrorMsg("searchResults", "No results for the given term were found! Check your spelling and make sure to capitalize appropriate letters.")
                    // }
                    // if(err.response.status === 500){
                    //     console.log("500 error")
                    //     this.setErrorMsg("searchResults", "Something went wrong! Please try again!")
                    // }
                    this.setState({
                        loading: false,
                    })
                });
    }

    renderMetadata = (metadata) => {
        console.info("we are in metadata")
        let metadataFields = [];
        for (const [key, value] of Object.entries(metadata)) {
            console.log(`${key}: ${value}`);
            metadataFields.push(
                <div style={{
                    display:"flex",
                    width: "100%",
                    margin:"7px 0",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    justifyContent: 'space-between',
                    // backgroundColor: "blue",
                }} key={key}>
                    <TextField value={key} 
                    style={{
                        width: "40%",
                        alignSelf: "flex-start"
                    }} />
                    <TextareaAutosize value={value} 
                    style={{
                        maxWidth: "60%",
                        minWidth: "60%",
                        alignSelf: "center",
                    }} />
                </div>
                
            )
        }
        // for (const property in metadata){
        //     metadataFields.push(
        //         <div key={property}>
        //             <h1>{property}: {metadata.property}</h1>
        //             <h2>{metadata.property}</h2>
        //         </div>
                
        //     )
        // }
        return metadataFields;
    }

    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Import a record:</Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
                {this.state.stage}
                {(this.state.stage === 1) &&
                    <div>
                        <form onSubmit={this.handleSubmit}  className={classes.formField}>
                            <Typography variant="body2">
                                Paste your BibTeX text into the input field below.
                            </Typography>
                            <FormControl error={this.state.errors.bibtex ? true : false} className={classes.searchContainer}  >
                                <TextareaAutosize name="bibtex" onChange={this.handleChange} value={this.state.bibtex} aria-label="empty textarea" placeholder="BibTex" style={{borderColor: (this.state.errors.bibtex && "red") , maxWidth: "100%",}}/>
                                <FormHelperText id="component-helper-text">{ this.state.errors.bibtex }</FormHelperText>
                            </FormControl>
                            <Button disabled={this.state.loading} variant="contained" color="primary" onClick={this.handleSubmit} style={{marginRight: "0",
                                // marginLeft: "auto",
                                alignSelf: "flex-start",  
                                marginTop: "3px",
                                // height: "minContent"
                                }}>
                                Parse BibTeX
                            </Button>
                        </form>
                    </div>
                }
                {(this.state.stage !== 1) && (this.state.articles.length !== 0) &&
                    this.state.articles.map((article, index) => {
                        return (
                            <div key={"article_"+index}>
                                <EditableArticleCard name={"article_"+index} key={index} article={article}/>
                                {this.renderMetadata(article.metadata)}
                            </div>
                        )
                    }
                )}
            </Paper>
        </div>
    )}

//     this.state.articles.map((article, index) => (
//         <ArticleCard name={"article_"+index} key={index} article={article}/>
//     ))

    // Object.keys(article.metadata).map((key, index)=> (
    //     <h2>{key}</h2>
    // ));
    // for (const [key, value] of Object.entries(article.metadata)) {
    //     console.log(`${key}: ${value}`);
    // }
    
    // <>
    //     <EditableArticleCard name={"article_"+index} key={index} article={article}/>
    // </>

}

ImportRecord.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(ImportRecord);
