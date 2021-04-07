import axios from "axios";

export default () => {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if(localStorage.getItem('token') !== null) {
        headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    }

    return axios.create({
        baseURL: 'http://localhost:3000/api',
        withCredentials: false,
        headers: headers
    })
}
