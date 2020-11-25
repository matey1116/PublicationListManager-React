import React from 'react'

import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import MendeleyPhoto from './Mendeley.jpg'
import OrcidPhoto from './Orcid.jpg'
import ScopusPhoto from './Scopus.jpg'


const providers = {
    Mendeley: MendeleyPhoto,
    Orcid: OrcidPhoto, 
    Scopus: ScopusPhoto
}

const useStyles = makeStyles({
    providerCard:{
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
    },
    linkText: {
        textDecoration: `none`,
        textTransform: `uppercase`,
        color: `white`
    },   
});

function LogInProviders(props) {
    const classes = useStyles();
    return (
        <div>
            {props.providers.map(({ providerName, providerURL }) => (
                        <div key={providerName} className={classes.providerCard} 
                            style={{
                            //   backgroundColor: "yellow"  
                            }}>
                            <img alt={providerName} height="50px" style={{
                                borderRadius: "8px"
                            }} src={eval("providers."+providerName)}/>
                            <Button target="_blank" variant="contained" color="primary" style={{
                                //  margin: "0 0px",
                                marginLeft:"auto",
                                marginRight:"0",
                                // width:"max-content"
                                }} href={providerURL} key={providerName} className={classes.linkText}>
                                Log in
                            </Button>
                        </div>
                ))
            }
        </div>
    )
}
export default LogInProviders;