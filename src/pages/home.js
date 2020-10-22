import axios from 'axios';

const Home = () => {
    sendRequest()
    return (
        "HI"
    );
}
const sendRequest = () => {
    axios.post("http://localhost:8080/hello")
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err);
        });
}

export default Home
