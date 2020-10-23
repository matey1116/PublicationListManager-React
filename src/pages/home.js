import axios from 'axios';

const Home = () => {
    sendRequest()
    return (
        "HI"
    );
}
const sendRequest = () => {
    console.log(axios.defaults.headers.common, )
    axios.get("http://localhost:8080/hello", {withCredentials: true})
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err.response);
        });
}

export default Home
