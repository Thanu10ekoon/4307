import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // change if your backend URL differs
});

export default instance;
