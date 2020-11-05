import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField } from "@material-ui/core"
import { useTheme } from '@material-ui/core/styles';
import axios from "axios";

function TwoFactorLogin() {
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const theme = useTheme();
    const useStyles = makeStyles({
        formCard: {
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
            margin: "20px 0"
        },
        successContainer: {
            maxWidth: "650px",
            margin: "30px auto"
        }
    });
    const handleSubmit = () =>{
        if (code === "") return setCodeError("Required Field")
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
    const classes = useStyles();
    return (
        <div className={classes.formCard}>
            <Typography variant="body2"> 
                The app generates a numerical code, which is needed to log in.
                This will make sure your account can be accessed only by you.
                Open the Google Authentication app and copy the code into the box below.
            </Typography>
            <TextField
                id="code"
                name="code"
                type="number"
                label="Authentication Code"
                variant="outlined"
                value={code}
                // onChange={this.handleChange}
                onChange={event => setCode(event.target.value)}
                helperText={codeError}
                error={codeError ? true : false}
                style={{marginTop:"10px"}}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    )
}

export default TwoFactorLogin;