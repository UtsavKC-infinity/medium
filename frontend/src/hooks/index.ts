import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const useBlog = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  console.log("outside useeffect");
 useEffect(() => {
   console.log("inside useEffect");

   const token = localStorage.getItem("token");

   if (!token) {
     setLoading(false); // No token, so no need to continue loading
     return; // Exit early
   }

   axios
     .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
       headers: {
         Authorization: token,
       },
     })
     .then((response) => {
       console.log(response.data.blogs);
       setBlogs(response.data.blogs);
       setLoading(false);
     })
     .catch((error) => {
       console.log(error.response.data.error);
       setLoading(false); // Error occurred, set loading to false
     });
 }, []);

  return {
    loading,
    blogs,
  };
};
