import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import axios from "axios";

import Navbar from "./components/Navbar.js"

export class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            token: "",
            radio: "",
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
        if (this.state.stage === 1) {
            let valid = true;
            if (this.state.email === "") {
                valid = false;
                this.setState((prevState, props) => ({
                    errors: {
                        ...prevState.errors,
                        email: "Required Field",
                    },
                }));
            }
            if (this.state.password === "") {
                valid = false;
                this.setState((prevState, props) => ({
                    errors: {
                        ...prevState.errors,
                        password: "Required Field",
                    },
                }));
            }

            if (valid) {
                axios
                    .post("http://localhost:8080/login", {
                        email: this.state.email,
                        password: this.state.password,
                    })
                    .then((res) => {
                        if (res.data.jwt === "2FA") {
                            this.setState({
                                stage: 2,
                            });
                        }
                        else{
                            sessionStorage.setItem("Authentication", `Bearer ${res.data.jwt}`);
                            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;
                            console.log(res.data.jwt)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
        else{
            if(this.state.token !== ""){
                axios
                    .post("http://localhost:8080/login", {
                        email: this.state.email,
                        password: this.state.password,
                        token: this.state.token
                    })
                    .then((res) => {
                        if (res.data.jwt) {
                            sessionStorage.setItem("Authentication", `Bearer ${res.data.jwt}`);
                            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;
                            console.log(res.data.jwt)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };

    render() {
        return this.state.stage === 1 ? (
            <>
                <Navbar/>
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
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        style={{ width: "200px" }}
                        helperText={this.state.errors.password}
                        error={this.state.errors.password ? true : false}
                    />
                    <br />
                    <br />
                    <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                        Login
                    </Button>
                </form>
            </>
        ) : (
            <>
                <TextField
                    id="token"
                    name="token"
                    type="number"
                    label="Google Authenticator Code"
                    value={this.state.token}
                    onChange={this.handleChange}
                    style={{ width: "200px" }}
                    helperText={this.state.errors.token}
                    error={this.state.errors.token ? true : false}
                />
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Authenticate
                </Button>
            </>
        );
    }
}

export default login;
