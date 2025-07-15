import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-app-znyk.onrender.com/api/ChatApp",
  withCredentials: true
});

export default API;
