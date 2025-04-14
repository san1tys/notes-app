import axios from 'axios';
import { BASE_URL } from "./constants"

const axiosPublic = axios.create({
    baseURL: BASE_URL,
});

export default axiosPublic;