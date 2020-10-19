import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from 'axios';
import login from './pages/login'
import register from './pages/register'
import twoFactor from './pages/twoFactor'
import home from "./pages/home";
import activateAcc from './pages/activate'
if (sessionStorage.Authentication) {
   axios.defaults.headers.common["Authorization"] = sessionStorage.Authentication;
}


axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        config.url = config.url.replace("http://localhost:8080", "https://floating-ravine-90491.herokuapp.com"/*"https://t2kgifwbac.execute-api.eu-central-1.amazonaws.com/v1" */);
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

function App(props) {
   return (
      <Router>
         <CssBaseline />
         <Container
            maxWidth="xl"
            style={{
               paddingTop: "80px",
            }}
         >
            <Switch>
               <Route exact path="/" component={home} />
               <Route exact path="/login" component={login} />
               <Route exact path="/2fa" component={twoFactor} />
               <Route exact path="/register" component={register} />
               <Route exact path="/activateAccount/:id" component={activateAcc} />
            </Switch>
         </Container>
      </Router>
   );
}

export default App;
