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

import SendMesssageButton from "../../components/SendMessageButton";

import { priceToCurrency } from "../../utils/currency";
import { scrollToTop } from "../../utils/ux";

import DataContext from "../../context/DataContext";

const Order = () => {
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
      sum += order.products[i].quantity * order.products[i].price;
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
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
          scrollToTop();
        });
    })();
    scrollToTop();
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
      <Typography variant="h4">Order Details</Typography>

      <Typography variant="body1" mb={3}>
        <strong>Order Ref:</strong>
        {orderid}
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
              order?.stall?.image
                ? `${PUBLIC_FOLDER}stalls/${order?.stall?.image}`
                : `${PUBLIC_FOLDER}stalls/noimage.png`
            }
            alt={order?.stall?.name}
          />
        </Grid>

        <Grid item xs={8} p={2} alignSelf="stretch">
          <Grid container direction="column" height="100%">
            <Grid item flexGrow={1}>
              <Typography variant="h6" gutterBottom>
                Stall Details
              </Typography>
              <Typography variant="body1">{order?.stall?.name}</Typography>
              <Typography variant="body2">{order?.stall?.location}</Typography>
              <Box component="div" p={1}>
                <Divider />
              </Box>
              {/* <Typography variant="body2">
                <strong>Phone: </strong>
                {order?.stall?.phone || "Not supplied"}
              </Typography> */}
              <Typography variant="body2">
                <strong>Email: </strong>
                {order?.stall?.email || "Not supplied"}
              </Typography>
            </Grid>
            <Grid item>
              <Box textAlign="right">
                <SendMesssageButton stall={stall} user={user}>
                  Contact Stall
                </SendMesssageButton>
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
          <LineItem product={product} key={product.id} />
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

export default Order;

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
            {product.name}
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
            {product.quantity}
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
            {priceToCurrency(product.price)}
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
            {priceToCurrency(product.quantity * product.price)}
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
            {product.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};
