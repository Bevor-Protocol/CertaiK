import axios from "axios";

export default axios.create({
  baseURL: process.env.API_URL,
  headers: {
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
  timeout: 0, // Disable timeout for streaming
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

export { streaming_api };
