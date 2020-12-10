import React, { Component } from 'react'
import { Button, Typography, Paper, FormControl, FormHelperText, 
    InputLabel, InputAdornment, Input, IconButton, TextField} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';
import { Alert, AlertTitle } from '@material-ui/lab';

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

export class ChangePasswordDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            newPassword: "",
            repeatNewPassword: "",
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
        this.setState({errors: {
            ...this.state.errors,
            ["password"]: null,
            ["newPassword"]: null,
            ["repeatNewPassword"]: null,
        }});
        if (!this.state.passwordConfirmed) {
            let valid = true;
            if (this.state.password === "") valid = this.setErrorMsg("password","Required Field");
            const lowercaseLetterRegex = RegExp('[a-z]');
            const upperLetterRegex = RegExp('[A-Z]');
            const digitRegex = RegExp('[0-9]')
            if(this.state.newPassword.length < 8 || !lowercaseLetterRegex.test(this.state.newPassword) || !upperLetterRegex.test(this.state.newPassword) || !digitRegex.test(this.state.newPassword)){
                valid = this.setErrorMsg("newPassword","Not complying with the requirements")
            }
            if(this.state.newPassword === this.state.password) valid = this.setErrorMsg("newPassword","The new password is the same as the old one")
            
            if (this.state.repeatNewPassword !== this.state.newPassword) valid = this.setErrorMsg("repeatNewPassword","Passwords do not match")
            if (this.state.repeatNewPassword === "") valid = this.setErrorMsg("repeatNewPassword","Required Field")


            if (valid) {
                axios
                    .post("http://localhost:8080/account/change", {
                        password: this.state.password,
                        newPassword: this.state.newPassword,
                        repeatNewPassword: this.state.repeatNewPassword,
                    })
                    .then((res) => {
                        console.log(res.data)
                        this.setState({ 
                            passwordConfirmed: true,
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        console.log(err.response)
                        if (err.response.data.password) this.setErrorMsg("password","Wrong password!")
                    });
            }
        } 
    };    

    render (){
        const { classes } = this.props;
        return (
            <Paper elevation={7} className={classes.formCard} >
                <IconButton onClick={()=>{this.props.handleClose()}} aria-label="delete" style={{marginLeft:"auto", margiBottom:"10px",  padding:"0",}}>
                    <CancelIcon color="secondary"/>
                </IconButton>
                {this.state.passwordConfirmed === false &&
                    <div className={classes.cardContent}>
                        <Typography variant="h6">Changing password</Typography>
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
                        <FormControl className={classes.formField} error={this.state.errors.newPassword ? true : false} required>                            
                            <InputLabel>New Password</InputLabel>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                autoComplete="new-password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.newPassword}
                                onChange={this.handleChange}
                            />
                            <FormHelperText id="component-helper-text">{this.state.errors.newPassword}</FormHelperText>
                            <FormHelperText error={false} id="password-requirements">Password must be at least 8 characters long, and it has to contain at least: one uppercase letter, one lowercase letter, and one digit.</FormHelperText>
                        </FormControl>
                        
                        <FormControl className={classes.formField} error={this.state.errors.repeatNewPassword ? true : false} required>                            
                            <InputLabel>Repeat New Password</InputLabel>
                            <Input
                                id="repeatNewPassword"
                                name="repeatNewPassword"
                                autoComplete="new-password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.repeatNewPassword}
                                onChange={this.handleChange}
                            />
                            <FormHelperText id="component-helper-text">{this.state.errors.repeatNewPassword}</FormHelperText>
                        </FormControl>

                        <div>
                            <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{marginLeft: "0px", marginTop: "20px"}}>
                                Change Password
                            </Button>
                        </div>
                    </div>
                }
                
                {this.state.passwordConfirmed === true &&
                    <Alert style={{margin: "20px 5px"}} variant="filled" severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        The password has been successfully changed!
                    </Alert>
                }
                
                <br/>
            </Paper>
    )}
}

ChangePasswordDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(ChangePasswordDialog);