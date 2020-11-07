import React, { Component } from "react";
import { Link, Button, TextField, Container, Typography, Paper,
    FormHelperText, FormControl, InputLabel, Input, IconButton, InputAdornment } from "@material-ui/core/";
import { Visibility, VisibilityOff, } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "axios";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Link as routingLink } from "react-router-dom";

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
    submitContainer: {
        margin: "40px 0",
        display: "flex",
        padding: "0 10px",
        alignItems: "center",
    },
    successContainer: {
        maxWidth: "650px",
        margin: "30px auto"
    }
});

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            repeatPassword: "",
            showPassword: false,
            // token: "",
            // radio: "",
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
        let valid = true;
        if (this.state.firstName === "") valid = this.setErrorMsg("firstName","Required Field")
        if (this.state.lastName === "") valid = this.setErrorMsg("lastName","Required Field")
        if (this.state.email === "") valid = this.setErrorMsg("email","Required Field")
        const lowercaseLetterRegex = RegExp('[a-z]');
        const upperLetterRegex = RegExp('[A-Z]');
        const digitRegex = RegExp('[0-9]')
        // const passwordRegex = RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
        if(this.state.password.length < 8 || !lowercaseLetterRegex.test(this.state.password) || !upperLetterRegex.test(this.state.password) || !digitRegex.test(this.state.password)){
            valid = this.setErrorMsg("password","Failed test")
        }
        if (this.state.repeatPassword !== this.state.password) valid = this.setErrorMsg("repeatPassword","Passwords do not match")
        if (this.state.repeatPassword === "") valid = this.setErrorMsg("repeatPassword","Required Field")

        // if(valid){
        //     axios.post
        // }Object.values(this.state.errors).every((el) => el == null)
        // if(JSON.stringify(this.state.errors) === '{}'){
        //     console.log(JSON.stringify(this.state.errors))
        //     console.log("no errors, gooo")
        // }
        // else console.log("erros, stop")

        if (valid) {
            axios
                .post("http://localhost:8080/account/register", {
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    password: this.state.password,
                    repeatPassword: this.state.repeatPassword,
                    // type: this.state.radio,
                    // token: this.state.token,
                })
                .then((res) => {
                    console.log(res)
                    console.log("we are in")
                    if (res.data === "Registered") {
                        this.setState({
                            stage: 2,
                        });
                    }
                })
                .catch((err) => {
                    console.log("error:")
                    console.log(err.response.data);
                    if (err.response.status===400) {
                        for (const [fieldName, errorMessage] of Object.entries(err.response.data)) {
                            this.setErrorMsg(fieldName,errorMessage)
                        }
                    }
                    console.log(err.response.data);
                    
                    console.log(err.response.status);
                    console.log(err)
                });
        }
    };

    render() {
        const { classes } = this.props;
        return this.state.stage === 1 ? (
            <>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Create a free account!</Typography>
                <Typography variant="body2">
                    Gather all of your publications in one place. Correct the information about your publications and present your work to the world!
                </Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
            <form onSubmit={this.handleSubmit}>
            <div className={classes.fieldsContainer}>
                <TextField
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="First Name"
                    required
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    className={classes.narrowField}
                    helperText={this.state.errors.firstName}
                    error={this.state.errors.firstName ? true : false}
                />
                <TextField
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    required
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    className={classes.narrowField}
                    helperText={this.state.errors.lastName}
                    error={this.state.errors.lastName ? true : false}
                />
                <br />
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
                        // helperText={this.state.errors.password}
                        // error={this.state.errors.password ? true : false}
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
                    <FormHelperText id="password-requirements">Password must be at least 8 characters long, and it has to contain at least: one uppercase letter, one lowercase letter, and one digit.</FormHelperText>
                    {/* <FormHelperText id="component-helper-text">{this.state.errors.password}</FormHelperText> */}
                </FormControl>
                <br/>
                {/* <FormControl className={classes.formField}> */}
                    {/* <InputLabel htmlFor="standard-adornment-repeat-password">Repeat Password</InputLabel> */}
                    <TextField
                        id="repeatPassword"
                        name="repeatPassword"
                        required
                        className={classes.formField}
                        style={{marginTop:"-5px-"}}
                        autoComplete="new-password"
                        label="Repeat Password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.repeatPassword}
                        onChange={this.handleChange}
                        helperText={this.state.errors.repeatPassword}
                        error={this.state.errors.repeatPassword ? true : false}
                    />
                {/* </FormControl> */}
                <br/>
                <div className={classes.submitContainer}>
                <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{marginRight: "10px"}}>
                    Register
                </Button>
                <Typography variant="body2">
                    Do you already have an account?&nbsp;
                    <Link component={routingLink} to={"/login"}>
                        Log&nbsp;in
                    </Link>
                    &nbsp;now! 
                </Typography>
                </div>
                <div className={classes.submitContainer}>
                <Typography variant="caption">
                    By creating an account, you agree to our&nbsp; 
                    <Link href="/terms&conditions" target="_blank">Terms and Conditions</Link>
                    . Please read our&nbsp;
                    <Link href="/privacyPolicy" target="_blank">Privacy Policy</Link>.
                </Typography>
                </div>
                
                </div>
            </form>
            </Paper>
            </>
        ) : (
            <Container className={classes.successContainer}>
                <Alert variant="filled" severity="success">
                    <AlertTitle>Success!</AlertTitle>
                    The account has been created. Check your inbox for an <strong>Activation Email</strong>!
                </Alert>
            </Container>
        );
    }
}
Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default register;
export default withStyles(styles)(Register);
