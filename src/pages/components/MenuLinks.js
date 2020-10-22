import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from "@material-ui/core"
import { Link } from "react-router-dom";

const useStyles = makeStyles({
    navDisplayFlex: {
      display: `flex`,
    //   justifyContent: `center`
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `white`
    }
  });

function MenuLinks({navLinks}) {
    const classes = useStyles();
    return (
        <List component="nav" className={classes.navDisplayFlex}  aria-labelledby="main navigation">
            {navLinks.map(({ title, path }) => (
                <ListItem style={{ margin: "0 0px", width:"max-content"}} button component={Link} to={path} key={title} className={classes.linkText}>
                    <ListItemText primary={title}/>
                </ListItem>
            ))}
        </List>
    )
}

export default MenuLinks
