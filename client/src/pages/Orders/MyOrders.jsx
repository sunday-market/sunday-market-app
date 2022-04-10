import { useState, useEffect, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Alert, Typography } from "@mui/material";

import OrderCard from "../../components/Orders/OrderCard";
import DataContext from "../../context/DataContext";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  // const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setError, setLoading } = useContext(DataContext);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal: controller.signal,
        };

        const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
        const orders = await axios.get(
          `/api/order/user/${decodedJWT.id}`,
          config
        );

        setOrders(orders.data);
      } catch (error) {
        setLoading(false);
        if (axios.isCancel(error)) return;
        setError([error]);
      }
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [navigate, setLoading, setError]);

  return (
    <Box
      component="main"
      p={2}
      sx={{
        flexGrow: 1,
      }}
    >
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
