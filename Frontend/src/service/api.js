import axios from "axios";
import store from "@/store";

export default () => {
    const token = 'Bearer ' + store.state.current_user.token + ' ' + store.state.current_user.id;

    return axios.create({
        baseURL: 'http://localhost:3000/api',
        withCredentials: false,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization" : token
        }
    })
}
