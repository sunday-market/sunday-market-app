import { useState, useEffect, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Typography } from "@mui/material";

import SadEmoji from "../../assets/emojisad.png";
import OrderCard from "../../components/Orders/ReceivedOrderCard";
import DataContext from "../../context/DataContext";

const ReceivedOrders = () => {
  const [orders, setOrders] = useState([]);

  const { setError, setLoading } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
      };

      await axios
        .get(`/api/order/received/${decodedJWT.id}`, config)
        .then((stall) => {
          setOrders(stall.data);
        })
        .catch((error) => {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
        });
    })();
    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [navigate, setError, setLoading]);

  return (
    <Box p={{ xs: 1, sm: 2, md: 4 }}>
      <Typography variant="h4" gutterBottom>
        Received Orders
      </Typography>
      <Typography variant="body1" gutterBottom>
        The order you have recieved from customers will display below. These are
        grouped by your stall.
      </Typography>

      {orders.length === 0 && (
        <Box backgroundColor="#e0e0e0" p={3} textAlign="center">
          <Typography variant="h5" gutterBottom>
            None of your stalls have received any orders.
          </Typography>
          <Box component="img" src={SadEmoji} alt="Sad Emoji" width="150px" />
        </Box>
      )}

      {orders.map((stall) => (
        <Grid container key={stall._id}>
          <Grid
            item
            xs={12}
            backgroundColor="#01a9f4"
            mt={2}
            p={1}
            sx={{ border: "solid 1px #e0e0e0" }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
              }}
            >
              {stall.stallName}
            </Typography>
          </Grid>
          {stall.orders.length === 0 ? (
            <Typography>{stall.stallName} has received no orders.</Typography>
          ) : (
            <>
              {stall.orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id} p={1}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      ))}
    </Box>
  );
};

export default ReceivedOrders;
