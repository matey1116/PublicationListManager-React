import React, {Component} from "react";
import { InputBase, Button, Link, Container, Typography, Paper, FormControl, FormHelperText, InputLabel, InputAdornment, Input, IconButton, TextField} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import { fade, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link as routingLink } from "react-router-dom";
import { withStyles } from '@material-ui/styles';

// const useStyles = makeStyles(theme => ({
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
search: {
    color: theme.palette.primary.main,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    }   
})
// const classes = useStyles();
// export default function QueryDBLP() {

class QueryDBLP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            repeatPassword: "",
            showPassword: false,
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
        console.log("submitting the form")
        if(this.state.searchTerm === ""){
            return this.setErrorMsg("searchTerm", "Required Field")
        }
    }
    render(){
        const { classes } = this.props;
        return (
        <div>
            <Container color="primary" className={classes.textContainer}>
                <Typography variant="h6">Query DBLP:</Typography>
            </Container>
            <Paper elevation={7} className={classes.formCard}>
            <form onSubmit={this.handleSubmit}>
                <div className={classes.fieldsContainer}>
                {/* <TextField id="search-field" label="Search" type="search" /> */}
                <br/>
                <FormControl error={this.state.errors.searchTerm ? true : false}  className={classes.formField} required>
                <div style={{
                    display: "flex"
                }}>
                    {/* <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div> */}
                    <TextField
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        helperText={this.state.errors.searchTerm}
                        error={this.state.errors.searchTerm ? true : false}
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                        // error={true}
                        name="searchTerm"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                    
                    <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{marginRight: "0",
                        marginLeft: "auto"}}>
                        <SearchIcon/> Search
                    </Button>
                </div>
                        {/* <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            id="password"
                            name="password"
                            label="Password"
                            type={this.state.showPassword ? 'text' : 'password'}
                            value={this.state.password}
                            onChange={this.handleChange}
                            autoComplete="new-password"
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
                        <FormHelperText id="component-helper-text">{(" " === this.state.errors.password ? this.state.errors.password: (""))}</FormHelperText> */}
                    </FormControl>
                    <br/>
                        <div className={classes.submitContainer}>
                        <Button variant="contained" color="primary" style={{marginRight: "10px"}}>
                            Log in
                        </Button>
                        <Typography variant="caption">
                            <Link component={routingLink} to={"/forgottenPassword"}>Forgot Password?</Link>
                        </Typography>
                        </div>
                    </div>
            </form>
            </Paper>
        </div>
    )}

}
// export default QueryDBLP;
QueryDBLP.propTypes = {
    classes: PropTypes.object.isRequired,
};
    
export default withStyles(styles)(QueryDBLP);
