import axios from "axios";

export default axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CERTAIK_API_KEY}`,
  },
});

const streaming_api = axios.create({
  baseURL: process.env.API_URL,
  responseType: "stream",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CERTAIK_API_KEY}`,
  },
});

export { streaming_api };
