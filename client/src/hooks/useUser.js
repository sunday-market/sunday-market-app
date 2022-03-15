import { useState, useEffect } from "react";
import jwt from "jwt-decode";
import axios from "axios";

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const fetchCurrentUser = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        try {
          const decodedJWT = await jwt(localStorage.getItem("authToken"));
          const currentUser = await axios.get(
            `/api/user/${decodedJWT.id}`,
            config
          );
          setUser(currentUser.data.data);
        } catch (error) {
          console.log(error);
          setTimeout(() => {}, 5000);
        }
      };
      fetchCurrentUser();
    }
  }, []);

  return user;
};
