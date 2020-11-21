import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({loggedIn, component: Component, restricted, ...rest}) => {
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            loggedIn && restricted ?
                <Redirect to="/" />
            :   <Component {...props} />
        )} />
    );
};

export default PublicRoute;