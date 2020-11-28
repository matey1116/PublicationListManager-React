import React, { Component } from "react";

import { Link, Typography, TextField, Button, IconButton, FormControl, FormHelperText, FormControlLabel, Checkbox, Container, Paper, Collapse} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import AppleIcon from '@material-ui/icons/Apple';
import AndroidIcon from '@material-ui/icons/AndroidOutlined';
import { withStyles } from '@material-ui/styles';
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "axios";
import PropTypes from 'prop-types';

const styles = theme => ({
    formCard: {
        backgroundColor: "#b2dfdb",
        // color: "white",
        color: theme.palette.primary.main,
        padding: "30px 25px",
        margin: "0 auto",
        maxWidth: "550px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
    textContainer: {
      maxWidth: "550px",
      margin: "auto",
      marginTop:"40px",
      marginBottom: "20px",
    },
    submitContainer: {
        // margin: "20px 0",
        // padding: "3px 5px",
        maxWidth: "300px",
        margin: "20px auto",
    },
    successContainer: {
        maxWidth: "650px",
        margin: "30px auto"
    }
});


export class Activate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 1,
            timer: 5,
            checkbox: false,
            uuid: props.match.params.id,
            imageURL: "",
            secret: "",
            code: "",
            errors: {},
            cantScan: false,
        };
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

    handleChange = (event) => {
        if (event.target.name === "checkbox") {
            this.setErrorMsg("checkbox", "")
            this.setState((prevState)=>({
                checkbox: !prevState.checkbox,
            }));

            if(this.state.imageURL === ""){
                axios
                .get(`http://localhost:8080/account/generateQR/${this.state.uuid}`)
                .then((res) => {
                    this.setState({ 
                        imageURL: res.data.qrcode,
                        secret: res.data.secret,
                    })
                    console.log("imageURL : "+this.state.imageURL)
                    console.log("secret : "+this.state.secret)
                })
                // .catch((err) => console.log(err.response.data));
                .catch((err) => {
                    console.log(err);

                    if (err.response.data.uuid) this.setErrorMsg("checkbox", "Something went wrong. Please try again.")
                    console.log(err.response.data);
                });
            }
            
        }
        if(event.target.name === "code"){
            this.setState({code: event.target.value})
        }
    };

    handleActivate = (event) => {
        event.preventDefault();
        if (this.state.checkbox === false) {
            axios
                .get(`http://localhost:8080/account/activate/${this.state.uuid}`)
                .then((res) => {
                    console.log(res.data)
                    this.showSuccess()
                })
                .catch((err) => {
                    if (err.response.data.uuid) this.setErrorMsg("errorAlert", "Error: Something went wrong. Please try again.")
                    console.log(err.response.data);
                })
        } else {

            if(this.state.code.length === 0) return this.setErrorMsg("code","Required Field")
            axios
                .post(`http://localhost:8080/account/2fa`, {code: this.state.code, uuid: this.state.uuid})
                .then((res) => {
                    console.log(res.data)
                    this.showSuccess()
                })
                .catch((err) => {
                    if (err.response.data.code === "Bad Code") this.setErrorMsg("code", "The code is invalid. Try again.")
                    if (err.response.data.code === "Code must not be empty") this.setErrorMsg("code", "Required Field")
                    console.log(err.response.data);
                })
        }
    };
    showSuccess = () =>{
        this.setState(()=>({
            stage: 2,
        }));
        var countdown = setInterval(()=>{
            if(this.state.timer < 1) {
                clearInterval(countdown);
                return this.props.history.push('/')
            }
            this.setState((prevState)=>({
                timer: prevState.timer-1,
            }));
        }, 1000)
    }

    render() {
        const { classes } = this.props;
        return this.state.stage === 1 ? (
            <div>
                <Container color="primary" className={classes.textContainer}>
                    <Typography variant="h6">Almost finished!</Typography>
                </Container>
                <Paper elevation={7} className={classes.formCard}>
                    <Collapse in={this.state.errors.errorAlert !== undefined && this.state.errors.errorAlert !== ""}>
                        <Alert severity="error" style={{marginBottom:"20px"}}>
                           <IconButton aria-label="close" color="inherit" size="small" onClick={()=>{this.setErrorMsg("errorAlert","")}}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        </Alert>
                    </Collapse>
                    <div>
                        <Typography variant="body1">
                            Enable Two-Factor Authentication (2FA) for even greater security! 
                            To use Two-Factor Authentication, Google's Authentication app is required.
                            Every time you log in, you will be asked to input a code that can be found in the Google Authentication App.
                        </Typography>
                        <FormControl 
                            className={classes.checkbox}
                            error={this.state.errors.checkbox !== ""}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checkbox}
                                        onChange={(event) =>
                                            this.handleChange({ target: { name: "checkbox" } })
                                        }
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Enable 2FA"
                            />
                        {this.state.errors.checkbox && this.state.checkbox && 
                            <FormHelperText id="checkbox-err">{this.state.errors.checkbox}</FormHelperText>}
                        </FormControl>    
                    </div>
                <Collapse in={this.state.checkbox && this.state.imageURL !== ""}>
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

                <Button className={classes.submitContainer} variant="contained" color="primary" onClick={this.handleActivate}>
                    Activate
                </Button>
                </Paper>
            </div>
        ):(
            <Container className={classes.successContainer}>
                <Alert variant="filled" severity="success">
                    <AlertTitle>Success!</AlertTitle>
                    Your account has been activated! You will be redirected to the Homepage in <strong>{this.state.timer}</strong>
                </Alert>
            </Container>
        );
    }
}
Activate.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Activate);