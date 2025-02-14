import axios from "axios";

export default axios.create({
  baseURL: "https://api.cookie.fun/v2",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.COOKIE_API_KEY,
  },
});
