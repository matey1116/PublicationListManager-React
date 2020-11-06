import React from 'react'
import { useState } from "react";

import { SwipeableDrawer , makeStyles, Container, List, ListItem, ListItemText, IconButton } from "@material-ui/core"
import { Link } from "react-router-dom";
import { Menu } from "@material-ui/icons"

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: "#00796b",
  },
})
const SideDrawer = (props) => {
    const classes = useStyles();
    const [state, setState] = useState({ right: false })
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return
        }
        setState({ [anchor]: open })
    }

    const sideDrawerList = anchor => (
      <Container
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List component="nav">
          {props.navLinks.map(({ title, path }) => (
              <ListItem button component={Link} to={path} key={title} className={classes.linkText}>
                  <ListItemText primary={title}/>
              </ListItem>
          ))}
          {props.loggedIn ? 
                <ListItem button component={Link} to='/' key="Log out" className={classes.linkText} 
                  onClick={props.logOut}>
                  <ListItemText primary="Log out"/>
                </ListItem>
              :<>
                  <ListItem button component={Link} to='/login' key="Log in" className={classes.linkText}>
                    <ListItemText primary="Log in"/>
                  </ListItem>
                  <ListItem button component={Link} to='/register' key="Register" className={classes.linkText}>
                    <ListItemText primary="Register"/>
                  </ListItem>
                </>
              }
        </List>
      </Container>
    );

    return (
      <React.Fragment>
        <IconButton onClick={toggleDrawer("right", true)} aria-label="menu">
          <Menu fontSize="large" style={{ color: "white" }}/>
        </IconButton>
        <SwipeableDrawer 
          anchor="right"
          open={state.right}
          onOpen={toggleDrawer("right", true)}
          onClose={toggleDrawer("right", false)}
          disableSwipeToOpen={true}
        >
          {sideDrawerList("right")}
        </SwipeableDrawer>
      </React.Fragment>
    )
}
export default SideDrawer
