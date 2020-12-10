import React, {useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import {Container, CssBaseline} from "@material-ui/core";
import axios from 'axios';
import Login from './pages/Login'
import Register from './pages/Registration/Register'

import TwoFactorLogin from './pages/TwoFactorLogin'
import home from "./pages/home"
import QueryDBLP from "./pages/QueryDBLP"
import ImportRecord from "./pages/ImportRecord"
import Records from "./pages/Records"
import ViewRecords from "./pages/ViewRecords"
import Profile from "./pages/Profile/Profile"
import SharedLink from "./pages/SharedLink"
import ManualImport from "./pages/ManualImport"

import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import Activate from './pages/Registration/Activate'
import Navbar from "./pages/Header/Navbar";
import Footer from "./pages/Footer";

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
         main: "#00a3cc",
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
                  minHeight: "80vh",
               }}
            >
               <Switch>
                  <PrivateRoute exact path="/profile" loggedIn={loggedIn} component={Profile}/>

                  {/* These 2 should be private */}
                  <PrivateRoute exact path="/records" loggedIn={loggedIn} component={Records}/>
                  <PrivateRoute exact path="/records/view" loggedIn={loggedIn} component={ViewRecords}/>
                  <PrivateRoute exact path="/importRecord" loggedIn={loggedIn} component={ImportRecord}/>
                  <PrivateRoute exact path="/records/import/manual" loggedIn={loggedIn} component={ManualImport}/>

                  <PublicRoute restricted={true} exact path='/login' loggedIn={loggedIn} component={routeProps => <Login {...routeProps} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
                  <PublicRoute restricted={false} exact path='/' component={home} />
                  <PublicRoute restricted={true} exact path='/2fa' component={TwoFactorLogin} />
                  <PublicRoute restricted={true} exact path='/register' component={Register} />
                  <PublicRoute restricted={true} exact path='/activateAccount/:id' component={Activate} />
                  {/* <PublicRoute restricted={false} exact path='/queryDBLP' loggedIn={loggedIn} component={QueryDBLP} /> */}
                  <PublicRoute restricted={false} exact path='/queryDBLP' loggedIn={loggedIn} component={routeProps => <QueryDBLP {...routeProps} loggedIn={loggedIn}/>} />
                  <PublicRoute restricted={false} exact path='/share/:id' loggedIn={loggedIn} component={routeProps => <SharedLink {...routeProps} loggedIn={loggedIn}/>} />


                  {/* <Route exact path="/" component={home} /> */}
                  {/* <Route exact path='/login' render={routeProps => <Login {...routeProps} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} /> */}
                  {/* <Route exact path="/2fa" component={TwoFactorLogin} /> */}
                  {/* <Route exact path="/register" component={Register} /> */}
                  {/* <Route exact path="/activateAccount/:id" component={Activate}/> */}
                  {/* <Route exact path="/queryDBLP" component={QueryDBLP}/> */}
                  {/* <Route exact path="/profile" component={Profile}/> */}
               </Switch>
            </Container>
            <Footer/>
         </ThemeProvider>
      </Router>
   );
}

export default App;