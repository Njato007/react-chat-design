import axios from "axios";

const BASE_URL = 'http://localhost:5000';

const Axios = (token) => {
    console.log("token", token)
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        
    });
}

export default Axios;