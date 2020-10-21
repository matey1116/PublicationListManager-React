import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Home } from "@material-ui/icons"
import { AppBar, Toolbar, Container, List, ListItem, ListItemText } from "@material-ui/core"

import SideDrawer from "./SideDrawer"
const navLinks = [
  { title: `Home`, path: `/` },
  { title: `Login`, path: `/login` },
  { title: `Register`, path: `/register` },

  { title: `about us`, path: `/about-us` },
  { title: `product`, path: `/product` },
  { title: `blog`, path: `/blog` },
  { title: `contact`, path: `/contact` },
  { title: `faq`, path: `/faq` },
]

const useStyles = makeStyles({
  appBar: {
    padding: "0"
  },
  navLeftContainer: {
    display: `flex`,
    justifyItems: "center",
    justifyContent: `space-between`
  },
  navRightContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`
  }
});
// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

const Navbar = () => {
  
  
  const classes = useStyles();
  return (
    <div >
      <AppBar className={classes.appBar} position="static">
        <Toolbar >
          <Container maxWidth="md" className={classes.navLeftContainer}>
            <IconButton edge="start" color="inherit" aria-label="home">
              <Home fontSize="large" />
              <Typography style={{marginLeft:"5px"}} variant="h6">
                Publication List Manager
              </Typography>
            </IconButton>
            {/* Add code */}
          </Container>
          <Container className={classes.navRightContainer} style={{backgroundColor: ""}}>
            {/* <List component="nav" className={classes.navDisplayFlex}  aria-labelledby="main navigation">
              {navLinks.map(({ title, path }) => (
                <Button color="secondary" href={path} key={title}>
                  {title}
                  <ListItem button>
                    <ListItemText primary={title} />
                  </ListItem>
                </Button>
              ))}
            </List> */}
            <SideDrawer navLinks={navLinks}/>
          </Container>
          {/* Add code end */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;