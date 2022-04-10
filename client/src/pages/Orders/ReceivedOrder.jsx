import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import {
  Button,
  Typography,
  Divider,
  Box,
  Grid,
  CardMedia,
} from "@mui/material";

import SendMessageButton from "../../components/SendMessageButton";
import { priceToCurrency } from "../../utils/currency";
import DataContext from "../../context/DataContext";

const ReceivedOrder = () => {
  const [order, setOrder] = useState({});
  const [user, setUser] = useState({});
  const [stall, setStall] = useState({});

  const navigate = useNavigate();
  const { orderid } = useParams();

  const { setError, setLoading } = useContext(DataContext);

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const getTotalOrderPrice = () => {
    let sum = 0;
    for (let i = 0; i < order?.products?.length; i++) {
      sum += order?.products[i].quantity * order?.products[i].price;
    }
    return priceToCurrency(sum);
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    (async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
      };

      await axios
        .get(`/api/order/${orderid}`, config)
        .then((order) => {
          setOrder(order.data);
        })
        .catch((error) => {
          setLoading(true);
          if (axios.isCancel(error)) {
            return "axios request cancelled...";
          }
          setError([error]);
        });
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [orderid, navigate, setLoading, setError]);

  // Set User and Stall data to correct format
  // for SendMessageButton component
  useEffect(() => {
    setUser({
      _id: order?.customer?.id,
    });

    setStall({
      _id: order?.stall?.id,
      stallName: order?.stall?.name,
    });
  }, [order]);

  return (
    <Box p={{ xs: 1, sm: 2, md: 4 }}>
      <Typography variant="h4">Customer Order</Typography>

      <Typography variant="body1">
        <strong>Order Ref: </strong>
        {orderid}
      </Typography>
      <Typography variant="body1" mb={3}>
        <strong>Order Date: </strong>
        {new Date(order?.createdAt).toLocaleDateString()}
        &nbsp;
        {new Date(order?.createdAt).toLocaleTimeString()}
      </Typography>

      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        backgroundColor="#f0f0f0"
        border="solid 2px #e0e0e0"
        borderRadius={2}
        spacing={0}
      >
        <Grid item xs={4}>
          <CardMedia
            component="img"
            height="100%"
            image={
              order?.customer?.image
                ? `${PUBLIC_FOLDER}users/${order?.customer?.image}`
                : `${PUBLIC_FOLDER}users/noimage.jpg`
            }
            alt={order?.stall?.name}
          />
        </Grid>

        <Grid item xs={8} p={2} alignSelf="stretch">
          <Grid container direction="column" height="100%">
            <Typography variant="h6" gutterBottom>
              Customer Details
            </Typography>
            <Grid
              item
              flexGrow={1}
              backgroundColor="white"
              borderRadius={2}
              p={2}
            >
              <Typography variant="body1">{order?.customer?.name}</Typography>
              <Typography variant="body2">
                {order?.customer?.location}
              </Typography>
              <Box component="div" p={1}>
                <Divider />
              </Box>
              <Typography variant="body2">
                <strong>Phone: </strong>
                {order?.customer?.phone || "Not supplied"}
              </Typography>
              <Typography variant="body2">
                <strong>Email: </strong>
                {order?.customer?.email || "Not supplied"}
              </Typography>
            </Grid>
            <Grid item>
              <Box textAlign="right" pt={2}>
                <SendMessageButton stall={stall} user={user}>
                  Contact Customer
                </SendMessageButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box component="div" py={3} />

      <Grid
        container
        backgroundColor="#f0f0f0"
        border="solid 1px #e0e0e0"
        p={1}
      >
        <Grid item xs={7}>
          <Typography variant="body1" fontWeight="bold">
            Product
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="body1" fontWeight="bold" align="center">
            Qty
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" fontWeight="bold" align="right">
            Price
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" fontWeight="bold" align="right">
            Total
          </Typography>
        </Grid>
      </Grid>

      {/* Order Line Items  */}
      <Grid container spacing={0}>
        {order?.products?.map((product) => (
          <LineItem product={product} key={product?.id} />
        ))}
      </Grid>

      {/* Totals  */}
      <Grid
        container
        backgroundColor="#f0f0f0"
        border="solid 1px #e0e0e0"
        p={1}
      >
        <Grid item xs={7}>
          <Typography variant="body1">
            <strong>Order Total</strong>
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="body1" align="right">
            <strong>{getTotalOrderPrice()}</strong>
          </Typography>
        </Grid>
      </Grid>

      <Box textAlign="center" m={3}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default ReceivedOrder;

const LineItem = ({ product }) => {
  return (
    <>
      {/* Image  */}
      <Grid item></Grid>
      <Grid container>
        <Grid item xs={7} p={1} pb={0}>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product?.name}
          </Typography>
        </Grid>

        <Grid item xs={1} p={1} pb={0}>
          <Typography
            variant="body2"
            align="center"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product?.quantity}
          </Typography>
        </Grid>
        <Grid item xs={2} p={1} pb={0}>
          <Typography
            variant="body2"
            align="right"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {priceToCurrency(product?.price)}
          </Typography>
        </Grid>
        <Grid item xs={2} p={1} pb={0}>
          <Typography
            variant="body2"
            align="right"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {priceToCurrency(product?.quantity * product?.price)}
          </Typography>
        </Grid>
        <Grid item xs={12} p={1} pt={0}>
          <Typography
            variant="body2"
            color="grey.500"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product?.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};
