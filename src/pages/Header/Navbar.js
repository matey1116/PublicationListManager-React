import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Home, KeyboardArrowUp } from "@material-ui/icons"
import { Container, Hidden, Button, Divider, AppBar, Toolbar, IconButton, Typography, Fab } from "@material-ui/core"

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
  { title: `Search`, path: `/queryDBLP` },
  { title: `Profile`, path: `/profile` },
]
const loggedOutNavLinks = [
  { title: `Home`, path: `/` },
  { title: `Search`, path: `/queryDBLP` },
]
const dropdownLinks = [
  { title: `View / edit`, path: `/records/view` },
  { title: `Export / Share`, path: `/records/share` },
  { title: `Import from BibTeX`, path: `/records/import/bibtex` },
  { title: `Manually add`, path: `/records/import/manual` },
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
        <Toolbar style={{display:"flex", flexDirection: "row", justifyContent:"space-between"}} >
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
          {/* <Divider orientation="vertical" flexItem light/> */}
          <Hidden mdDown>
            <div style={{
              //  backgroundColor: "blue",
               margin:" 0 auto",
              }}>
              <MenuLinks loggedIn={props.loggedIn} navLinks={props.loggedIn ? loggedInNavLinks : loggedOutNavLinks} />            
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
            <SideDrawer navLinks={props.loggedIn ? loggedInNavLinks.concat(dropdownLinks) : loggedOutNavLinks} loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} logOut={logOut}/>
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