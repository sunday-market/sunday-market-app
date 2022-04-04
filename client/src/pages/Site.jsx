import { useEffect, useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";

import PageLoading from "../components/PageLoading";
import Navigation from "../components/Navigation/Navigation";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";

import DataContext from "../context/DataContext";

import FeedbackAlert from "../components/FeedbackAlert";

const Site = () => {
  const { loading, error, success } = useContext(DataContext);

  return (
    <>
      <Box display="flex" flexDirection="column" height="100vh">
        <FeedbackAlert
          severity="error"
          message={error[0]?.response?.data?.error || error}
        />

        <FeedbackAlert severity="success" message={success} />

        {/* Navigation Bar  */}
        <Nav />

        {/* Outlet  */}
        <Box flex={1}>
          {loading ? (
            <PageLoading />
          ) : (
            <>
              <Outlet />
            </>
          )}
        </Box>

        {/* Footer  */}

        <Footer />
      </Box>
    </>
  );
};

export default Site;
