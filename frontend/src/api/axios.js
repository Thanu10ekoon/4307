import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // change if your backend URL differs
});

export default instance;
