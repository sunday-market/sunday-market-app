import React from "react";
import { Box, Grid, Container, Typography } from "@mui/material";

import { useNavigate } from "react-router";

import OrderCard from "../../components/Orders/OrderCard";

const MyOrders = () => {
  const navigate = useNavigate();



  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>

            <Grid
              item
              lg={4}
              md={4}
              sm={6}
              xs={12}
              onClick={() => navigate("/")}
            >
              <OrderCard />
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default MyOrders;
