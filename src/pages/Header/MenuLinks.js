import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, List, ListItem, ListItemText } from "@material-ui/core"
import { Link } from "react-router-dom";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles({
    navDisplayFlex: {
      display: `flex`,
      justifyContent:"space-around"
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `white`
    },
    dropdownLink: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `#00796b`
    },
  });

function MenuLinks({navLinks, loggedIn}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const dropdownLinks = [
        { title: `View / edit`, path: `/records/view` },
        { title: `Export / Share`, path: `/records/share` },
        { title: `Import from BibTeX`, path: `/records/import/bibtex` },
        { title: `Manually add`, path: `/records/import/manual` },
    ]
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
        <List component="nav" className={classes.navDisplayFlex}  aria-labelledby="main navigation">
            {navLinks.map(({ title, path }) => (
                <ListItem style={{
                  //  margin: "0 0px",
                    width:"max-content"}} button component={Link} to={path} key={title} className={classes.linkText}>
                    <ListItemText primary={title}/>
                </ListItem>
            ))}
              {loggedIn &&
                <ListItem style={{
                    width:"max-content"}} button onClick={handleMenu} className={classes.linkText}>
                    <ListItemText>
                      <div style={{display:"flex", alignContent:"center",}}>
                        RECORDS<ArrowDropDownIcon/>
                      </div>
                    </ListItemText>
                </ListItem>
              }
              <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
              >   
                  {dropdownLinks.map(({ title, path }) => (
                    <MenuItem component={Link} to={path} key={title} onClick={handleClose} className={classes.dropdownLink}>{title}</MenuItem>
                  ))}
              </Menu>
        </List>
    )
}

export default MenuLinks
