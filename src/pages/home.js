// import axios from 'axios';

// const Home = () => {
    // sendRequest()
    // let jwt = axios.defaults.headers.common["Authorization"];
    // console.log(jwt)
    // if(jwt !== undefined){
    //     jwt = JSON.parse(atob(jwt.split('.')[1]));
    //     console.log( "session storage: ")
    //     console.log(jwt)
    // }
    // else console.log("no token")
    // return (
        // "HI"
    // );
// }
// export default Home

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
// import { Home, KeyboardArrowUp } from "@material-ui/icons"
import { Menu, MenuItem, Hidden, Button, Divider, AppBar, Toolbar, IconButton, Typography, Fab } from "@material-ui/core"
// import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles({
    container: {
        marginTop:"90px",
        display: "flex",
        flexDirection: "row",
        justifyContent:"space-between",
        // backgroundColor: "blue",
    },
    titleContainer: {
        padding: "10px 10px",
        color: "white",
        backgroundColor: "#00796b",
        // border: 1,
        borderRadius: 15,
        // boxShadow: '0 3px 5px 2px #b5dfdcc9',
    },
    homeTextContainer: {
        display: "flex",
        flexDirection: "column",
        // marginLeft: "30px",
        padding: "10px 10px",
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px #b5dfdcc9',
    },
});

const Home = (props) => {
  const classes = useStyles();
  return (
    <div style={{display: "flex", flexDirection:"column"}}>
        <div className={classes.container}>
            <div className={classes.titleContainer}>
                <Typography variant="h1">Publication<br/> List<br/> Manager</Typography>
            </div>
            
            <div className={classes.homeTextContainer}>
                <Typography color="primary" variant="h4">
                    Manage all of your references from one place
                </Typography>
                <Typography color="secondary" variant="h3">
                    Import records from BibTeX files, DBLP or manually
                </Typography>
                <Typography color="primary" variant="h5">
                    Share your records with others
                </Typography>
                <Typography color="secondary" variant="h2">
                    Export records to <strong>CSV</strong>, <strong>XML</strong> or <strong>BibTeX</strong>
                </Typography>
            </div>
        </div>
        <Typography color="primary" variant="h4" style={{margin:"10px auto", textAlign: 'center',}}>
            All of our services are completely free, so there is nothing stopping you from jumping on the <strong>PLM</strong> ship.
        </Typography>
    </div>
    
  );
}


export default Home;
