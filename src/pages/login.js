import React, { Component } from "react";
import { Button, Link, Container, Typography, Paper, FormControl, FormHelperText, InputLabel, InputAdornment, Input, IconButton, TextField} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from "axios";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Link as routingLink } from "react-router-dom";

const styles = theme => ({
    formCard: {
        backgroundColor: "#b2dfdb",
        // color: "white",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "550px",
        display: "flex",
        justifyContent: "center",
    },
    formField: {
        width: "95%",
        marginTop: "7px"
    },
    textContainer: {
      maxWidth: "550px",
      margin: "auto",
      marginTop:"40px",
      marginBottom: "20px",
    },
    submitContainer: {
        margin: "36px 0",
        marginButtom: "0",
        display: "flex",
        padding: "0 10px",
        alignItems: "center",
    },
    formCardStage2: {
        backgroundColor: "#b2dfdb",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "550px",
        display: "flex",
        flexDirection: "column",
        alignItems:"center",
    },
});

export class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            showPassword: false,
            token: "",
            radio: "",
            stage: 1,
            errors: {},
        };
    }
    handleClickShowPassword = () => {
        this.setState({
            showPassword: (!this.state.showPassword)
        });
    };
    
    handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
        if (this.state.stage === 1) {
            let valid = true;
            if (this.state.email === "") valid = this.setErrorMsg("email","Required Field");
            if (this.state.password === "") valid = this.setErrorMsg("password","Required Field");
            if (valid) {
                axios
                    .post("http://localhost:8080/account/login", {
                        email: this.state.email,
                        password: this.state.password,
                    })
                    .then((res) => {
                        if (res.data.jwt === "2FA") {
                            console.log("res.data.jwt === 2FA")
                            console.log(this.state)
                            this.setState({
                                stage: 2,
                            });
                        }
                        else{
                            sessionStorage.setItem("Authentication", `Bearer ${res.data.jwt}`);
                            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;
                            console.log(res.data.jwt)
                            this.props.setLoggedIn(true)
                            return this.props.history.push('/')
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        if ((err.response.status===400) || (err.response.status===401)){
                            this.setErrorMsg("email","The email or password is incorrect!");
                            this.setErrorMsg("password"," ");
                        }
                    });
            }
        }
        else{          
            if(this.state.email === "" || this.state.password === "") return this.setState({  stage:1 });    
            if(this.state.token === "") return this.setErrorMsg("token","Required Field");
            console.log(this.state)
            axios
                .post("http://localhost:8080/account/login", {
                    email: this.state.email,
                    password: this.state.password,
                    token: this.state.token
                })
                .then((res) => {
                    if (res.data.jwt) {
                        sessionStorage.setItem("Authentication", `Bearer ${res.data.jwt}`);
                        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;
                        console.log(res.data.jwt)
                        this.props.setLoggedIn(true)
                        return this.props.history.push('/')
                    }
                })
                .catch((err) => {
                    if (err.response.data.token === "Invalid Token") this.setErrorMsg("token", "The code is invalid. Try again.")
                    if (err.response.data.code === "Bad Code") this.setErrorMsg("token", "The code is invalid. Try again.")
                    if (err.response.data.code === "Code must not be empty") this.setErrorMsg("token", "Required Field")
                    if (err.response.data.error === "Unauthorized") this.setState({  stage:1 });
                    console.log(err.response.data);
                    console.log(err.response.data.token);
                });
        }
    };
    
    render() {
        const { classes } = this.props;
        return this.state.stage === 1 ? (
            <>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Log in:</Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
            <form onSubmit={this.handleSubmit}>
            <div className={classes.fieldsContainer}>
                <TextField
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    autoComplete="email"
                    required
                    value={this.state.email}
                    onChange={this.handleChange}
                    className={classes.formField}
                    helperText={this.state.errors.email}
                    error={this.state.errors.email ? true : false}
                />
                <br/>
                <FormControl className={classes.formField} error={this.state.errors.password ? true : false} required>
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="password"
                        name="password"
                        label="Password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.password}
                        onChange={this.handleChange}
                        autoComplete="new-password"
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={this.handleClickShowPassword}
                                onMouseDown={this.handleMouseDownPassword}
                            >
                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                    <FormHelperText id="component-helper-text">{(" " === this.state.errors.password ? this.state.errors.password: (""))}</FormHelperText>
                </FormControl>
                <br/>
                <div className={classes.submitContainer}>
                <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{marginRight: "10px"}}>
                    Log in
                </Button>
                <Typography variant="caption">
                    <Link component={routingLink} to={"/forgottenPassword"}>Forgot Password?</Link>
                </Typography>
                </div>
                <Typography variant="body2" style={{margin: "30px auto"}}>
                    You don't have an account?&nbsp;
                    <Link component={routingLink} to={"/register"}>
                        Register
                    </Link>
                    &nbsp;now! 
                </Typography>
                </div>
            </form>
            </Paper>
            </>

        ) : (
            <div className={classes.formCardStage2}>
                <Typography variant="body2"> 
                    The app generates a numerical code, which is needed to log in.
                    This will make sure your account can be accessed only by you.
                    Open the Google Authentication app and copy the code into the box below.
                </Typography>
                <TextField
                    id="token"
                    name="token"
                    type="number"
                    label="Authentication Code"
                    value={this.state.token}
                    onChange={this.handleChange}
                    helperText={this.state.errors.token}
                    style={{marginTop:"10px"}}
                    error={this.state.errors.token ? true : false}
                />
                <Button variant="contained" style={{margin: "20px 0"}} color="primary" onClick={this.handleSubmit}>
                    Submit
                </Button>
            </div>
        );
    }
}
Login.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Login);
