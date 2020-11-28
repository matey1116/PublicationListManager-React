import React, { Component } from 'react'
import { FormControlLabel, Checkbox, Backdrop, Collapse, Button, Container, Typography, Paper } from "@material-ui/core";
import {  Link, FormControl, FormHelperText, InputLabel, InputAdornment, Input, IconButton, TextField} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';

import CloseIcon from '@material-ui/icons/Close';
import AppleIcon from '@material-ui/icons/Apple';
import AndroidIcon from '@material-ui/icons/AndroidOutlined';
import { Alert, AlertTitle } from "@material-ui/lab";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    formCard: {
        backgroundColor: "#dfedec",
        // color: "primary",
        color: "#00796b",
        padding: "10px 10px",
        // paddingTop: "50px",
        margin: "0 auto",
        maxWidth: "900px",
        zIndex: theme.zIndex.drawer + 2,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down('xs')]: {
            padding: "2px 2px",
            // paddingTop: "10px",
        },
    },

    cardContent: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        // backgroundColor: "red",
        padding: "30px 40px 40px 40px",
        [theme.breakpoints.down('xs')]: {
            padding: "25px 5px 30px 5px",
            // paddingTop: "10px",
        },
    },

    formField: {
        margin: "4px auto",
        width: "300px",
        // minWidth: "235px",
        [theme.breakpoints.down('xs')]: {
            width: "235px",
        },
    },

    submitContainer: {
        // margin: "20px 0",
        // padding: "3px 5px",
        maxWidth: "300px",
        margin: "20px auto",
    },
});

export class Toggle2FA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            showPassword: false,
            passwordConfirmed: false,
            stage: 1,
            errors: {}, 
            imageURL: "",
            secret: "",
            code: "",
            cantScan: false,
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
        if (!this.state.passwordConfirmed) {
            let valid = true;
            if (this.state.password === "") valid = this.setErrorMsg("password","Required Field");
            if (valid) {
                axios
                    .post("http://localhost:8080/account/enable2FA", {
                        stage: 1,
                        password: this.state.password,
                        enable: !this.props.twoFAenabled,
                    })
                    .then((res) => {
                        console.log(res.data)
                        console.log("Password confirmed")
                        this.setState({ 
                            passwordConfirmed: true,
                            imageURL: res.data.qrcode,
                            secret: res.data.secret,
                        })
                        console.log("imageURL : "+this.state.imageURL)
                        console.log("secret : "+this.state.secret)
                    })
                    .catch((err) => {
                        console.log(err)
                        console.log(err.response)
                        if (err.response.data.password) this.setErrorMsg("password","Wrong password!")
                    });
            }
        } else { 
            if(this.state.code.length === 0) return this.setErrorMsg("code","Required Field")
                axios
                    .post("http://localhost:8080/account/enable2FA", {
                        stage: 2,
                        password: this.state.password,
                        enable: !this.props.twoFAenabled,
                        code: this.state.code,
                    })
                    .then((res) => {
                        console.log(res.data)
                        this.props.handleClose()
                        this.props.change2faEnabled(true)
                        // this.showSuccess()
                    })
                    .catch((err) => {
                        if (err.response.data.token === "Invalid Token") this.setErrorMsg("code", "The code is invalid. Try again.")
                        // if (err.response.data.code === "Code must not be empty") this.setErrorMsg("code", "Required Field")
                        console.log(err.response.data);
                    })
        }
    };    

    render (){
        const { classes } = this.props;
        // console.log(this.props.twoFAenabled)
        return (
            
            // <div >
            <Paper elevation={7} className={classes.formCard} >
                <IconButton onClick={this.props.handleClose} aria-label="delete" style={{marginLeft:"auto", margiBottom:"10px",  padding:"0",}}>
                    <CancelIcon color="secondary"/>
                </IconButton>
                {this.state.passwordConfirmed === false &&
                    <div className={classes.cardContent}>
                        <Typography variant="h6">{this.props.twoFAenabled ? "Disabling" : "Enabling"} Two-Factor Authentication</Typography>
                        <Typography variant="body1" style={{marginTop:"5px"}} >Confirm your password:</Typography>
                        <FormControl className={classes.formField} error={this.state.errors.password ? true : false} required>                            
                            <InputLabel>Password</InputLabel>
                            <Input
                                id="password"
                                name="password"
                                label="Password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={this.handleChange}
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
                            <FormHelperText id="component-helper-text">{this.state.errors.password}</FormHelperText>
                        </FormControl>
                        <div>
                            <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{marginLeft: "0px", marginTop: "20px"}}>
                                Disable 2FA
                            </Button>
                        </div>
                    </div>
                }
                
                {this.state.passwordConfirmed === true &&
                    <div className={classes.cardContent}>
                        <Typography variant="h6">{this.props.twoFAenabled ? "Disabling" : "Enabling"} Two-Factor Authentication</Typography>
                        <Typography variant="body1">
                            Enable Two-Factor Authentication (2FA) for even greater security! 
                            To use Two-Factor Authentication, Google's Authentication app is required.
                            Every time you log in, you will be asked to input a code that can be found in the Google Authentication App.
                        </Typography>
                        <Collapse in={this.state.imageURL !== ""}>
                            <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
                                <img alt="QR Code" style={{margin:"0 auto", marginBottom:"5px",}} src={this.state.imageURL}/>
                    
                                <Typography variant="body2">
                                    If you can't scan the QR code, <Link color="secondary" component="button" 
                                    onClick={()=>{this.setState({cantScan: true})}} >
                                        click here</Link>&nbsp;!
                                </Typography>
                                <br/>
                                <Collapse in={this.state.cantScan}>
                                    <Typography variant="h6">
                                        Can't scan the QR code?
                                    </Typography>
                                    <Typography variant="body1">
                                        If you are unable to scan the QR code, enter the following code into the Google Authentication app to activate Two-Factor Authentication.
                                        <strong><br/>Code:&nbsp;{this.state.secret}</strong>
                                    </Typography>
                                    <br/>
                                </Collapse>
                                
                                <Typography variant="body1">
                                    Open the Google Authentication app and scan the QR code from above.
                                    The app generates a numerical code, which will be needed when logging in.
                                    This will make sure your account can be accessed only by you.
                                    The app is available for Android and IOS devices, and can be downloaded from the following links:
                                    <Link href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank"><AppleIcon fontSize="small"/></Link>&nbsp;
                                    <Link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank"><AndroidIcon fontSize="small"/></Link>
                                </Typography>
                                <TextField
                                    id="code"
                                    name="code"
                                    type="number"
                                    label="Authentication Code"
                                    variant="outlined"
                                    value={this.state.code}
                                    onChange={this.handleChange}
                                    helperText={this.state.errors.code}
                                    error={this.state.errors.code ? true : false}
                                    style={{marginTop:"10px"}}
                                />
                                
                            </div>
                        </Collapse>
                        {/* <div style={{backgroundColor: "grreen"}}> */}
                            <Button className={classes.submitContainer} variant="contained" color="primary" onClick={this.handleSubmit}>
                                Activate
                            </Button>
                        {/* </div> */}
                    </div>
                }
                
                <br/>
            </Paper>
            // </div>
    )}
}

Toggle2FA.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(Toggle2FA);