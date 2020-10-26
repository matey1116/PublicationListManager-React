import React, { Component } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import Button from "@material-ui/core/Button";
import QRCode from "qrcode.react";
import TextField from "@material-ui/core/TextField";

export class Activate extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            checkbox: false,
            uuid: props.match.params.id,
            imageURL: "",
            code: "",
            errors: {},
        };
    }

    handleChange = (event) => {
        if (event.target.name === "checkbox") {
            this.setState({
                checkbox: true,
            });

            axios
                .get(`http://localhost:8080/generateQR/${this.state.uuid}`)
                .then((res) => this.setState({ imageURL: res.data }))
                .catch((err) => console.log(err.response.data));
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
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err.response.data));
        } else {
            axios
                .post(`http://localhost:8080/2fa`, {code: this.state.code, uuid: this.state.uuid})
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err.response.data));
        }
    };

    render() {
        return (
            <div>
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
                <br />
                <br />
                <br />
                {this.state.checkbox && this.state.imageURL !== "" && (
                    <>
                        {/* <QRCode imageSettings={{ src: this.state.imageURL }} /> */}
                        <img src={this.state.imageURL}/>
                        <br />
                        <br />
                        <TextField
                            id="code"
                            name="code"
                            type="number"
                            label="code"
                            value={this.state.code}
                            onChange={this.handleChange}
                            style={{ width: "200px" }}
                            helperText={this.state.errors.code}
                            error={this.state.errors.code ? true : false}
                        />
                    </>
                )}
                <br />
                <br />

                <Button variant="contained" color="primary" onClick={this.handleActivate}>
                    Activate
                </Button>
            </div>
        );
    }
}

export default Activate;
