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
const SideDrawer = ({navLinks}) => {
    const classes = useStyles();
    const [state, setState] = useState({ right: false }) // Add this
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
          {navLinks.map(({ title, path }) => (
              <ListItem button component={Link} to={path} key={title} className={classes.linkText}>
                  <ListItemText primary={title}/>
              </ListItem>
          ))}
        </List>
      </Container>
    );

    return (
      <React.Fragment>
        <IconButton onClick={toggleDrawer("right", true)} edge="start" aria-label="menu">
          <Menu fontSize="large" style={{ color: "white" }}/>
        </IconButton>
        <SwipeableDrawer 
          anchor="right"
          open={state.right}
          onOpen={toggleDrawer("right", true)}
          onClose={toggleDrawer("right", false)}
        >
          {sideDrawerList("right")}
        </SwipeableDrawer>
      </React.Fragment>
    )
}
export default SideDrawer
