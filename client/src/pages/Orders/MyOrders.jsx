import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import jwtDecode from "jwt-decode";

import { Box, Grid, Alert, Typography } from "@mui/material";

import OrderCard from "../../components/Orders/OrderCard";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
        const orders = await axios.get(`/api/order/user/${decodedJWT.id}`);

        setOrders(orders.data);
      } catch (error) {
        setError(error.response.data.error);

        setTimeout(() => {
          setError("");
        }, 5000);
      }
    })();
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="h5">My Orders</Typography>
      <Typography variant="body1" mb={2}>
        View your past orders here. Select an order to view more details
      </Typography>
      <Grid container spacing={3}>
        {/* Order Cards */}
        {orders.map((order) => (
          <Grid
            key={order._id}
            onClick={() => navigate(`../${order._id}`)}
            item
            lg={4}
            md={4}
            sm={6}
            xs={12}
          >
            <OrderCard order={order} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyOrders;
