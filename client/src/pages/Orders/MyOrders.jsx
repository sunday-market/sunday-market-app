import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Alert, Typography } from "@mui/material";

import OrderCard from "../../components/Orders/OrderCard";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
        const orders = await axios.get(
          `/api/order/user/${decodedJWT.id}`,
          config
        );

        setOrders(orders.data);
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }

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
        View your past orders here.
      </Typography>

      {orders.length === 0 && (
        <Typography
          variant="body1"
          mb={2}
          p={2}
          textAlign="center"
          backgroundColor="grey.200"
        >
          <strong>No orders to display</strong> <br />
          Once you place an order through the cart it will display here!
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Order Cards */}
        {orders.map((order) => (
          <Grid key={order._id} item lg={4} md={4} sm={6} xs={12}>
            <OrderCard order={order} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyOrders;
