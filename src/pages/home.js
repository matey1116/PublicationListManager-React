import axios from 'axios';

const Home = () => {
    // sendRequest()
    let jwt = axios.defaults.headers.common["Authorization"];
    console.log(jwt)
    if(jwt !== undefined){
        jwt = JSON.parse(atob(jwt.split('.')[1]));
        console.log( "session storage: ")
        console.log(jwt)
    }
    else console.log("no token")
    return (
        "Welcome to our Publication List Manager, you can register for an account or Login to an existing account using the buttons above."
    );
}
// const sendRequest = () => {
//     axios.post("http://localhost:8080/hello")
//         .then((res) => {
//             console.log(res)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

export default Home
