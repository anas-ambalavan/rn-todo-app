import axios from "axios";

const instance = axios.create({
  baseURL: "https://rn-todo-app-api.herokuapp.com/api",
  // baseURL: "http://localhost:5000/api",
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (config.token) {
      config.headers["Authorization"] = `Bearer ${config.token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
