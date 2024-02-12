import axios, { CanceledError } from "axios";

export default axios.create({
  baseURL: "https://demo-aem.vercel.app/api",
});

export { CanceledError };
