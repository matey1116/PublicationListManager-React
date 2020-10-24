import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import axios from "axios";

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
        return this.state.stage === 1 ? (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    style={{ width: "200px" }}
                    helperText={this.state.errors.email}
                    error={this.state.errors.email ? true : false}
                />
                <br />
                <br />

                <TextField
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="First Name"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    style={{ width: "200px" }}
                    helperText={this.state.errors.firstName}
                    error={this.state.errors.firstName ? true : false}
                />
                <br />
                <br />

                <TextField
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    style={{ width: "200px" }}
                    helperText={this.state.errors.lastName}
                    error={this.state.errors.lastName ? true : false}
                />
                <br />
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Register
                </Button>
            </form>
        ) : (
            "Activation Email has been sent"
        );
    }
}

export default register;
