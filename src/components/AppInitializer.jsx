import React, { useEffect } from "react";
import axios from "axios";

const AppInitializer = () => {
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/csrf/", {
      withCredentials: true,
    });
  }, []);

  return null;
};

export default AppInitializer;
