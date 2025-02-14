import axios from "axios";

export default axios.create({
  baseURL: "https://api.gptzero.me/v2",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.GPTZ_API_KEY,
  },
});
