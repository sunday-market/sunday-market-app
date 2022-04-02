import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router";

import axios from "axios";
import jwtDecode from "jwt-decode";

import { Alert, AlertTitle, Box } from "@mui/material";

import PageLoading from "../components/PageLoading";
import Navigation from "../components/Navigation/Navigation";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";

const Site = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loggedInUser, setLoggedInUser] = useState();
  const [shoppingCart, setShoppingCart] = useState();

  const navigate = useNavigate();

  // Handle Authentication and Authorization
  useEffect(() => {
    if (error) {
      setError(error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }

    if (error.status === 401) {
      localStorage.removeItem("authToken");
      setError(error);
      navigate("/login");
    }
  }, [error, navigate]);

  // Get logged in user
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      (async () => {
        const decodedJWT = jwtDecode(localStorage.getItem("authToken"));

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        await axios
          .get(`/api/user/${decodedJWT.id}`, config)
          .then((user) => {
            setLoggedInUser(user);
          })
          .catch((error) => {
            setError(error.response.data.error);
          });
      })();
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Navigation Bar  */}
      <Nav />

      {/* Outlet  */}
      <Box flex={1}>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {success}
          </Alert>
        )}

        {loading ? (
          <PageLoading />
        ) : (
          <Outlet context={[error, setError]}/>
        )}
      </Box>

      {/* Footer  */}

      <Footer setError={setError} />
    </Box>
  );
};

export default Site;
