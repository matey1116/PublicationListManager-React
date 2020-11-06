import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Home, KeyboardArrowUp } from "@material-ui/icons"
import { Hidden, Button, Divider, AppBar, Toolbar, IconButton, Typography, Fab } from "@material-ui/core"

import HideOnScroll from "./HideOnScroll"
import SideDrawer from "./SideDrawer"
import MenuLinks from "./MenuLinks"
import BackToTop from "./BackToTop";
import { Link } from "react-router-dom";
// import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';

const navLinks = [
  { title: `Home`, path: `/` },
  // { title: `Login`, path: `/login` },
  // { title: `Register`, path: `/register` },
  { title: `Search`, path: `/search` },
  { title: `about us 2`, path: `/about-us` },
  { title: `about us 3`, path: `/about-us` },
  { title: `about us 4`, path: `/about-us` },
  { title: `about us 5`, path: `/about-us` },
]
const loggedOutLinks = [
  { title: `Log in`, path: `/login` },
  { title: `Register`, path: `/register` }
]

const useStyles = makeStyles({
  appBar: {
    padding: "5px 10px",
  },
  navLeftContainer: {
    marginLeft: "auto",
  },
  navRightContainer: {
    display: `flex`,
    flexDirection: "row",
  },
  navCenterContainer: {
    margin: "0 auto",
    flexDirection: "row",
  },
  regLogButt: {
    margin: "0 3px",
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent:"space-around"
  },
});

const Navbar = (props) => {
  const logOut = () => {
    sessionStorage.removeItem("Authentication");
    delete axios.defaults.headers.common["Authorization"];
    props.setLoggedIn(false)
  }
//   const checkAccess = () => {
//     const bearer = axios.defaults.headers.common["Authorization"];
//     try {
//         if (bearer) {
//             if (jwt.verify(bearer.split("Bearer ")[1], publicKey).access === 1) {
//                 console.log("access 1");
//                 return true;
//             }
//         }
//         return false;
//     } catch (err) {console.log(err)}
// };
  // const theme = useTheme();
  const classes = useStyles();

  return (
    <div>
    <HideOnScroll>
      <AppBar className={classes.appBar}  position="fixed" style={{
        // backgroundColor:"red"
        }} >
        <Toolbar style={{display:"flex", justifyContent:"space-between"}} >
          <div style={{
            maxWidth: "md", marginRight:"auto"
            // backgroundColor:"yellow",
          }}>
            <IconButton edge="start" color="inherit" aria-label="home" style={{
              width:"max-content"
            }}>
              <Home fontSize="large" />
              <Typography variant="h6">
                <Hidden only={['xxs']}>           
                    Publication List Manager
                </Hidden>
                <Hidden xsUp>           
                    PLM
                </Hidden>
              </Typography>             
            </IconButton>
          </div>
          <Divider orientation="vertical" flexItem light/>
          <Hidden mdDown>
            <div style={{
              //  backgroundColor: "blue",
               margin:" 0 auto",
              }}>
              <MenuLinks navLinks={navLinks}/>
            </div>
            <div>
              {props.loggedIn ? 
                <Button component={Link} to='/' onClick={()=>{logOut()}} 
                  className={classes.regLogButt} color="inherit">Log out
                </Button>
              :
                <MenuLinks navLinks={loggedOutLinks}/>
              }
            </div>
          </Hidden>
          <Hidden lgUp>
            <SideDrawer navLinks={navLinks} loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} logOut={logOut}/>
          </Hidden>
        </Toolbar>
      </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />
      <BackToTop>
        <Fab color="primary" size="large" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </BackToTop>
    </div>
  );
}


export default Navbar;