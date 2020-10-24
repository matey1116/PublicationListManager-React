import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card,CardContent,CardActions,Button, TextField, Container, Grid, Typography, Paper} from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
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
  tectContainer: {
    maxWidth: "550px",
    margin: "auto",
    marginBottom: "20px",
  }
}));

export default function Registration() {
  const classes = useStyles();

  return (
    <>
    <Container className={classes.tectContainer} style={{marginTop:"40px"}}>
        <Typography variant="h6">Create a free account!</Typography>
        <Typography variant="body2">
            Gather all of your publications in one place. Correct the information about your publications and present your work to the world!
        </Typography>
    </Container>
    <Paper elevation={7} className={classes.formCard}>
        <form noValidate autoComplete="off">
            <div className={classes.fieldsContainer}>
                <TextField color="secondary" id="fName" className={classes.formField} label="First name" />
                <TextField id="lName" className={classes.formField} label="Last name" />
                <br/>
                <TextField id="email" className={classes.formField} label="E-mail" /><br/>
                <TextField id="password" className={classes.formField} label="Password" /><br/>
                <TextField id="repeatPassword" className={classes.formField} label="Repeat password" /><br/>
            </div>
        </form>
    </Paper> 
    </>
  );
}
    
