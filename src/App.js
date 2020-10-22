import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from 'axios';
import login from './pages/login'
import register from './pages/register'
import twoFactor from './pages/twoFactor'
import home from "./pages/home"
import activateAcc from './pages/activate'

import Navbar from "./pages/components/Navbar";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00796b"
    },
    secondary: {
      main: "#ffa726",
    },
  },
});


if (sessionStorage.Authentication) {
   axios.defaults.headers.common["Authorization"] = sessionStorage.Authentication;
}


axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        config.url = config.url.replace("http://localhost:8080", "https://api.publicationlistmanager.me"/*"https://t2kgifwbac.execute-api.eu-central-1.amazonaws.com/v1" */);
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
         <ThemeProvider theme={theme}>
            <Navbar/>
            <Container
               maxWidth="xl"
               style={{
                  margin: "0",  
                  boxSizing: "border-box",
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
         </ThemeProvider>
      </Router>
   );
}

export default App;
