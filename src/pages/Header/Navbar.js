import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Home, KeyboardArrowUp } from "@material-ui/icons"
import { Hidden, Button, Divider, AppBar, Toolbar, IconButton, Typography, Fab } from "@material-ui/core"

import HideOnScroll from "./HideOnScroll"
import SideDrawer from "./SideDrawer"
import MenuLinks from "./MenuLinks"
import BackToTop from "./BackToTop";
import { Link } from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';

const loggedInNavLinks = [
  { title: `Home`, path: `/` },
  { title: `Query DBLP`, path: `/queryDBLP` },
  { title: `Profile`, path: `/profile` },
  { title: `Records`, path: `/records` },
  { title: `Import record`, path: `/importRecord` },
  { title: `View / edit records`, path: `/records/view` },
  { title: `Manually add record`, path: `/records/import/manual` },
]
const loggedOutNavLinks = [
  { title: `Home`, path: `/` },
  { title: `Query DBLP`, path: `/queryDBLP` },
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
  const classes = useStyles();
  const xxsScreen = useMediaQuery('(max-width:390px)');
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
                {!xxsScreen && 
                    <>Publication List Manager</>
                }
                {/* <Hidden only={['xxs']}>           
                    Publication List Manager
                </Hidden> */}
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
              <MenuLinks navLinks={props.loggedIn ? loggedInNavLinks : loggedOutNavLinks} />
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
            <SideDrawer navLinks={props.loggedIn ? loggedInNavLinks : loggedOutNavLinks} loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} logOut={logOut}/>
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