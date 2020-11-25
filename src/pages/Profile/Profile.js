import React, {Component} from "react";
import { Container, Typography, Paper } from "@material-ui/core";
import axios from "axios";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import LogInProviders from './LogInProviders'


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
    textContainer: {
        maxWidth: "550px",
        margin: "auto",
        marginTop:"40px",
        marginBottom: "20px",
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

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            providers: {},
            loadingProviders: true,
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
                        providers: providers,
                        // providers: [],
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

    render(){
        let tokenData = JSON.parse(atob(axios.defaults.headers.common["Authorization"].split('.')[1]));
        console.log(tokenData)
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Profile:</Typography>
            </Container>
            {console.log(this.state.providers)}
            <Paper elevation={7} className={classes.formCard}>
                <div className={classes.fieldsContainer}>

                    {tokenData.firstName}<br/>
                    {tokenData.lastName}<br/>
                    {tokenData.sub}<br/>

                    {this.state.loadingProviders ?
                        <h1>Loading providers...</h1> :
                        <LogInProviders providers={this.state.providers}/>
                    }
                    <br/>
                </div>
            </Paper>
        </div>
    )}

}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(Profile);
