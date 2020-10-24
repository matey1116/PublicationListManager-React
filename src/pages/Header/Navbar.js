import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Home, KeyboardArrowUp } from "@material-ui/icons"
import { Hidden, Button, Divider, AppBar, Toolbar, Container, IconButton, Typography, Fab } from "@material-ui/core"

import HideOnScroll from "./HideOnScroll"
import SideDrawer from "./SideDrawer"
import MenuLinks from "./MenuLinks"
import BackToTop from "./BackToTop";
import { Link } from "react-router-dom";

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

const useStyles = makeStyles({
  appBar: {
    padding: "0 10px"
  },
  navLeftContainer: {
    marginLeft: "10px",
    display: `flex`,
    justifyItems: "flex-start",
    width: 'max-content'
  },
  navRightContainer: {
    width:"max-content",
    display: `flex`,
    justifyContent: `flex-end`,
    flexDirection: "row",
    flexWrap: "nowrap",
    marginRight: "2%",
  },
  navCenterContainer: {
    margin: "0 auto",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  regLogButt: {
    margin: "0 3px",
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
    fontSize: '18px'
  }
});

const Navbar = () => {
  const classes = useStyles();
  return (
    <div>
    <HideOnScroll>
      <AppBar className={classes.appBar}  position="fixed" style={{
        // backgroundColor:"red"
        }} >
        <Toolbar style={{display:"flex"}} >
          <div className={classes.navLeftContainer} style={{
            maxWidth: "md"
            // backgroundColor:"yellow"
            }}>
            <IconButton edge="start" color="inherit" aria-label="home" style={{
              width:"max-content"
            }}>
              <Home fontSize="large" />
              <Typography variant="h6">
                Publication List Manager
              </Typography>
            </IconButton>
          </div>
          <Divider orientation="vertical" flexItem light/>
          <Hidden mdDown>
            <div className={classes.navCenterContainer} style={{
              //  backgroundColor: "blue"
              }}>
              <MenuLinks navLinks={navLinks}/>
            </div>
            <div className={classes.navRightContainer} style={{
              // backgroundColor: "orange"
              }}>
              {showLogInOutButts(classes)}
            </div>
          </Hidden>
          <Hidden lgUp>
            <Container className={classes.navRightContainer} style={{
              // backgroundColor: "orange"
              }}>
              <SideDrawer navLinks={navLinks}/>
            </Container>
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
const showLogInOutButts = (classes) => {
  let loggedIn = true
  if(loggedIn) return(
    <>
      <Button component={Link} to='/login' className={classes.regLogButt} color="inherit">Log in</Button>
      <Divider orientation="vertical" flexItem light/>
      <Button component={Link} to='/register' className={classes.regLogButt} color="inherit">Register</Button>
    </>
  )
  return(
      <Button component={Link} to='/logout' className={classes.regLogButt} color="inherit">Log out</Button>
  )
}

export default Navbar;