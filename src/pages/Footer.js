import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    footerContainer: {
        backgroundColor: "#00312c",
        padding: "30px 100px",
        color: "white",
        width: "100%",
        height: "300px",
        marginTop: "100px",
    },
  });

function Footer() {
    const classes = useStyles();
    return (
        <div className={classes.footerContainer}>
            Footer
        </div>
    )
}

export default Footer