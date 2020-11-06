import React, {useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {Container, CssBaseline} from "@material-ui/core";
import axios from 'axios';
import Login from './pages/Login'
import Register from './pages/Registration/Register'

import TwoFactorLogin from './pages/TwoFactorLogin'
import home from "./pages/home"
import Activate from './pages/Registration/Activate'
import Navbar from "./pages/Header/Navbar";
import { unstable_createMuiStrictModeTheme as createMuiTheme, ThemeProvider } from '@material-ui/core';
const theme = createMuiTheme({
   breakpoints: {
      keys: ["xxs","xs", "sm", "md", "lg", "xl"],
      values: {
        xxs: 0,
        xs: 390,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
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
// const [loggedIn, setLoggedIn] = useState("ola maddame");
function App(props) {
  const [loggedIn, setLoggedIn] = useState(()=>{
      if(axios.defaults.headers.common["Authorization"] === undefined) return false
      return true
  });
//   function requireAuth(nextState, replace, next) {
//    if (!authenticated) {
//      replace({
//        pathname: "/login",
//        state: {nextPathname: nextState.location.pathname}
//      });
//    }
//    next();
//  }
   return (
      <Router>
         <CssBaseline />
         <ThemeProvider theme={theme}>
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
            <Container
               style={{
                  boxSizing: "border-box",
                  margin: "0 auto",
                  maxWidth: "md",
                  paddingTop: "30px",
                  height: "310vh",
               }}
            >
               <Switch>
                  <Route exact path="/" component={home} />
                  <Route eact path='/login' render={routeProps => <Login {...routeProps} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
                  <Route exact path="/2fa" component={TwoFactorLogin} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/activateAccount/:id" component={Activate}/>
                  {/* <Route exact path="/profile" component={Profile}/> */}
               </Switch>
            </Container>
         </ThemeProvider>
      </Router>
   );
}

export default App;