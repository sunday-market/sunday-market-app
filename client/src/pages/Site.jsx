import { useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Alert, AlertTitle, Box } from "@mui/material";

import PageLoading from "../components/PageLoading";
import Navigation from "../components/Navigation/Navigation";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";

import DataContext from "../context/DataContext";

const Site = () => {
  const { loading, error, success } = useContext(DataContext);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Navigation Bar  */}
      <Nav />

      {/* Outlet  */}
      <Box flex={1}>
        {error && (
          <>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error?.response?.data.error || error}
            </Alert>
          </>
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
          <>
            <Outlet />
          </>
        )}
      </Box>

      {/* Footer  */}

      <Footer />
    </Box>
  );
};

export default Site;
