import React, { Component } from "react";
import { Button, TextField, Container, Typography, Paper } from "@material-ui/core/";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

   

   const styles = theme => ({
    formCard: {
        backgroundColor: "#b2dfdb",
        padding: "30px 20px",
        margin: "0 auto",
        maxWidth: "650px",
    },
    formField: {
        margin: "7px 15px",
        width: "230px"
    },
    fieldsContainer: {
        maxWidth: "550px",
        margin: "auto"
    },
    textContainer: {
      maxWidth: "550px",
      margin: "auto",
      marginTop:"40px",
      marginBottom: "20px",
    }
});
class register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            firstName: "",
            lastName: "",
            // token: "",
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

    handleSubmit = (event) => {
        event.preventDefault();
        let valid = true;
        if (this.state.email === "") {
            valid = false;
            this.setState((prevState, props) => ({
                errors: {
                    ...prevState.errors,
                    email: "Required Field",
                },
            }))
        }
        if (this.state.firstName === "") {
            valid = false;
            this.setState((prevState, props) => ({
                errors: {
                    ...prevState.errors,
                    firstName: "Required Field",
                },
            }))
        }
        if (this.state.lastName === "") {
            valid = false;

            this.setState((prevState, props) => ({
                errors: {
                    ...prevState.errors,
                    lastName: "Required Field",
                },
            }))
        }

        // if(valid){
        //     axios.post
        // }

        // if (Object.values(this.state.errors).every((el) => el == null)) {
        //     axios
        //         .post("http://localhost:8080/login", {
        //             email: this.state.email,
        //             type: this.state.radio,
        //             token: this.state.token,
        //         })
        //         .then((res) => {
        //             if (res.data === "OK") {
        //                 this.setState({
        //                     stage: 2,
        //                 });
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // }
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
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    className={classes.formField}
                    helperText={this.state.errors.firstName}
                    error={this.state.errors.firstName ? true : false}
                />
                <TextField
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    className={classes.formField}
                    helperText={this.state.errors.lastName}
                    error={this.state.errors.lastName ? true : false}
                />
                <br />
                <TextField
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    className={classes.formField}
                    helperText={this.state.errors.email}
                    error={this.state.errors.email ? true : false}
                />
                <br/>
                <TextField
                    id="password"
                    name="password"
                    type="text"
                    label="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    className={classes.formField}
                    helperText={this.state.errors.password}
                    error={this.state.errors.password ? true : false}
                />
                <br/>
                <TextField
                    id="repeatPassword"
                    name="repeatPassword"
                    type="text"
                    label="Repeat password"
                    value={this.state.repeatPassword}
                    onChange={this.handleChange}
                    className={classes.formField}
                    helperText={this.state.errors.repeatPassword}
                    error={this.state.errors.repeatPassword ? true : false}
                />
                <br/>
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Register
                </Button>
                </div>
            </form>
            </Paper>
            </>
        ) : (
            "Activation Email has been sent"
        );
    }
}
register.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default register;
export default withStyles(styles)(register);
