import React, {useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Home, KeyboardArrowUp } from "@material-ui/icons"
import { List, ListItem, ListItemText, Hidden, Button, Divider, AppBar, Toolbar, IconButton, Typography, Fab } from "@material-ui/core"

import HideOnScroll from "./HideOnScroll"
import SideDrawer from "./SideDrawer"
import MenuLinks from "./MenuLinks"
import BackToTop from "./BackToTop";
import { Link } from "react-router-dom";
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';

const navLinks = [
  { title: `Home`, path: `/` },
  // { title: `Login`, path: `/login` },
  // { title: `Register`, path: `/register` },
  { title: `about us 1`, path: `/about-us` },
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
    // display: `flex`,
    // justifyItems: "flex-start",
    // width: 'max-content'
  },
  navRightContainer: {
    // width:"max-content",
    display: `flex`,
    // justifyContent: `flex-end`,
    flexDirection: "row",
    // flexWrap: "nowrap",
  },
  navCenterContainer: {
    margin: "0 auto",
    flexDirection: "row",
    // flexWrap: "nowrap",
  },
  regLogButt: {
    margin: "0 3px",
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
    // fontSize: '18px'
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent:"space-around"
  },
});

const Navbar = (props) => {
  const showLogInOutButts = (classes) => {
    let loggedIn = false;
    if(axios.defaults.headers.common["Authorization"] !== undefined) loggedIn = true
    // console.log("loggedIn: "+loggedIn)
    if(!loggedIn) return(
      // <div style={{display:"flex"}}>
        // {/* <Button size="small" component={Link} to='/login' className={classes.regLogButt} color="inherit">Log in</Button>
        // <Divider orientation="vertical" flexItem light/>
        // <Button component={Link} to='/register' className={classes.regLogButt} color="inherit">Register</Button> */}

      // {/* </div> */}
      <MenuLinks navLinks={loggedOutLinks}/>

    )
    return(
      <List component="nav" className={classes.navDisplayFlex}  aria-labelledby="main navigation">
                <ListItem style={{width:"max-content"}} button component={Link} to={"/"} key={"Log out"} className={classes.regLogButt} onClick={
                  // logOut()
                  console.log("logging out")
                }>
                    <ListItemText primary={"Log out"}/>
                </ListItem>
        </List>
        // {/* <Button component={Link} onClick={()=>{ */}
          // console.log("logging out")
          // sessionStorage.removeItem("Authentication");
          // delete axios.defaults.headers.common["Authorization"];
        // }} to='/' className={classes.regLogButt} color="inherit">Log out</Button>
    )
  }
  const logOut = () => {
    console.log("logging out")
    sessionStorage.removeItem("Authentication");
    delete axios.defaults.headers.common["Authorization"];
    // this.setLoggedIn(false)
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
  console.log("props: "+props.loggedIn)
  const theme = useTheme();
  const classes = useStyles();
  // console.log(theme.breakpoints)
  // console.log(theme.breakpoints.down("xxs"))
  const checkLogged = () => {
    // console.log("running logged check")
    console.log("sessionStorage.Auth : "+sessionStorage.Authentication)
    if(sessionStorage.Authentication === undefined){
    // if(axios.defaults.headers.common["Authorization"] === undefined){
      return false
    }
    return true
  }
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
                <Hidden smUp>           
                    PLM
                </Hidden>
              </Typography>
              {/* <Hidden xsDown>
                <Typography variant="h6">
                  Publication List Manager
                </Typography>
              </Hidden> */}
              
            </IconButton>
          </div>
          {/* <Divider orientation="vertical" flexItem light/> */}
          <Hidden mdDown>
            <div style={{
              //  backgroundColor: "blue",
               margin:" 0 auto",
              }}>
              <MenuLinks navLinks={navLinks}/>
            </div>
            <div style={{
              // backgroundColor: "orange"
              }}>
              {showLogInOutButts(classes)}

              {/* {checkLogged() ? 
                <Button component={Link} to='/' onClick={()=>{
                    console.log("logging out")
                    sessionStorage.removeItem("Authentication");
                    delete axios.defaults.headers.common["Authorization"];
                    }} className={classes.regLogButt} color="inherit">Log out
                </Button>
                :
                <div style={{display:"flex"}}>
                  {console.log("showing logged out")}
                  <Button component={Link} to='/login' className={classes.regLogButt} color="inherit">Log in</Button>
                  <Divider orientation="vertical" flexItem light/>
                  <Button component={Link} to='/register' className={classes.regLogButt} color="inherit">Register</Button>
                </div>
              } */}





            </div>
          </Hidden>
          <Hidden lgUp>
            <SideDrawer navLinks={navLinks}/>
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