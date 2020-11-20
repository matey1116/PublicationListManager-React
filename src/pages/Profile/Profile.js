import React, {Component} from "react";
import { InputBase, Button, Link, Container, Typography, Paper, FormControl, FormHelperText, InputLabel, InputAdornment, Input, IconButton, TextField} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import { fade, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link as routingLink } from "react-router-dom";
import { withStyles } from '@material-ui/styles';
import MendeleyPhoto from './Mendeley.jpg'
import OrcidPhoto from './Orcid.jpg'
import ScopusPhoto from './Scopus.jpg'
const providers = {
    Mendeley: MendeleyPhoto,
    Orcid: OrcidPhoto, 
    Scopus: ScopusPhoto
}
// const useStyles = makeStyles(theme => ({
const styles = theme => ({
    formCard: {
        backgroundColor: "#b2dfdb",
        color: "white",
        // backgroundColor: theme.palette.primary.light,
        padding: "30px 20px",
        margin: "0 auto",
        maxWidth: "650px",
    },
    formField: {
        margin: "7px 15px",
        width: "500px",
        // minWidth: "235px",
        [theme.breakpoints.down('xs')]: {
            width: "235px",
        },
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
search: {
    color: theme.palette.primary.main,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    providerCard:{
        display: "flex",
        flexDirection: "row",
        // alignContent: "center",
        alignItems: 'center',

    },
    linkText: {
        textDecoration: `none`,
        textTransform: `uppercase`,
        color: `white`
    }   
})
// const classes = useStyles();
// export default function QueryDBLP() {

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            repeatPassword: "",
            showPassword: false,
            // token: "",
            providers: {},
            loadingProviders: true,
            // radio: "",
            stage: 1,
            errors: {},
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
        axios
            .get("http://localhost:8080/account/providers")
            .then((res) => {
                let providers = []
                console.log(res.data)
                if (!res.data.Providers){
                    console.log("there are providers")
                    for (const [providerName, providerURL] of Object.entries(res.data)) {
                        console.log(`${providerName}:  ${providerURL}`);
                        providers.push({
                            providerName: providerName,
                            providerURL: providerURL
                        })
                    }
                    console.log(providers)
                    this.setState({
                        // providers: providers,
                        providers: [],
                        loadingProviders: false
                    });
                    // console.log("loadingProvidres: "+this.state.loadingProviders )
                }
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
            })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log("submitting the form")
        if(this.state.searchTerm === ""){
            return this.setErrorMsg("searchTerm", "Required Field")
        }
        let valid = true;
        if (valid) {
            axios
                .get("http://localhost:8080/account/providers")
                .then((res) => {
                    console.log(res.data)
                    if (!res.data.Providers){
                        console.log("there are providers")
                        // this.state.providers = res.data;
                        for (const [providerName, providerURL] of Object.entries(this.state.providers)) {
                            console.log(`${providerName}: ${providerURL}`);
                            this.state.providers.push({
                                providerName: providerName,
                                providerURL: providerURL
                            })
                        }
                        console.log(this.state.providers)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    console.log(err.response)
                })
        }
    }
    render(){
        const { classes } = this.props;
        return (

        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Profile:</Typography>
            </Container>
            {/* {for (const [providerName, providerURL] of Object.entries(this.state.providers)) {
                console.log(`${providerName}: ${providerURL}`);
                
            }} */}
            
            
            {console.log(this.state.providers)}
            <Paper elevation={7} className={classes.formCard}>
            <form>
                <div className={classes.fieldsContainer}>
                {/* <TextField id="search-field" label="Search" type="search" /> */}
                <br/>
                {this.state.loadingProviders ?
                    <h1>Loading providers...</h1> :
                    this.state.providers.map(({ providerName, providerURL }) => (
                        <div key={providerName} className={classes.providerCard} 
                            style={{
                            //   backgroundColor: "yellow"  
                            }}>
                            {console.log("Scopus")}
                            {/* {console.log(eval(providers+".Scopus"))} */}
                            <img alt={providerName} height="50px" style={{
                                borderRadius: "8px"
                            }} src={eval("providers."+providerName)}/>
                            <Button target="_blank" variant="contained" color="primary" style={{
                                //  margin: "0 0px",
                                marginLeft:"auto",
                                marginRight:"0",
                                // width:"max-content"
                                }} href={providerURL} key={providerName} className={classes.linkText}>
                                Log in
                            </Button>
                        </div>
                ))}
                <br/>
                </div>
            </form>
            </Paper>
        </div>
    )}

}
// export default QueryDBLP;
Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(Profile);
