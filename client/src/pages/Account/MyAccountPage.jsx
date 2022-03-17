import React from "react";
import { Outlet, useNavigate } from "react-router";

import { Box, Grid, Button } from "@mui/material";

const AccountPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Account Controls  */}
      <Grid
        container
        spacing={1}
        justifyContent="center"
        padding={2}
        backgroundColor="white"
        border="solid 1px #c3c3c3"
      >
        <Grid item>
          <Button variant="contained" onClick={() => navigate("myaccount")}>
            Details
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => navigate("mystalls")}>
            My Stalls
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => navigate("myproducts")}>
            My Products
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => navigate("myorders")}>
            My Orders
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => navigate("ordersreceived")}
          >
            Orders Received
          </Button>
        </Grid>
      </Grid>

      {/* Nested Route  */}
      <Box
        display="flex"
        flexDirection="column"
        backgroundColor="#f5f5f5"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          mt={3}
          backgroundColor="white"
          border="solid 1px #c3c3c3"
          borderRadius="15px"
          padding={4}
          width="90%"
          minWidth="350px"
          maxWidth="900px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default AccountPage;
