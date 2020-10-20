import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Home } from "@material-ui/icons"
import { Container, List, ListItem, ListItemText } from "@material-ui/core"

const navLinks = [
  { title: `about us`, path: `/about-us` },
  { title: `product`, path: `/product` },
  { title: `blog`, path: `/blog` },
  { title: `contact`, path: `/contact` },
  { title: `faq`, path: `/faq` },
]

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`
  },
  navDisplayFlex: {
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

export default function Navbar() {
  const classes = useStyles();
  return (
    <div >
      <AppBar position="static">
        <Toolbar>
          <Container maxWidth="md" className={classes.navbarDisplayFlex}>
            <IconButton edge="start" color="inherit" aria-label="home">
              <Home fontSize="large" />
              <Typography variant="h6" gutterBottom>
                Publication List Manager
              </Typography>
            </IconButton>
            {/* Add code */}
          </Container>
          <Container>
            <List component="nav" className={classes.navDisplayFlex}  aria-labelledby="main navigation">
              {navLinks.map(({ title, path }) => (
                <Button color="secondary" href={path} key={title}>
                  {title}
                  {/* <ListItem button>
                    <ListItemText primary={title} />
                  </ListItem> */}
                </Button>
              ))}
            </List>
          </Container>
          {/* Add code end */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
