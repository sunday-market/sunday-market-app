import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
} from "@mui/material";

import { Article as ArticleIcon } from "@mui/icons-material";

import SendMessageButton from "../SendMessageButton";

const OrderCard = ({ order }) => {
  const [user, setUser] = useState({});
  const [stall, setStall] = useState({});

  const navigate = useNavigate();

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  // Set User and Stall data to correct format
  // for SendMessageButton component
  useEffect(() => {
    setUser({
      _id: order.customer.id,
    });

    setStall({
      _id: order.stall.id,
      stallName: order.stall.name,
    });
  }, [order]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "solid 1px #eeeeee",
      }}
    >
      <CardMedia
        component="img"
        height="100"
        image={
          order.stall.image
            ? `${PUBLIC_FOLDER}stalls/${order.stall.image}`
            : `${PUBLIC_FOLDER}stalls/noimage.png`
        }
        alt={order.stall.name}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">{order.stall.name}</Typography>
          <Typography variant="body2">
            <strong>Phone: </strong>
            {order.stall.phone}
          </Typography>
          <Typography variant="body2" mb={2}>
            <strong>Email: </strong>
            {order.stall.email}
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">
                {new Date(order.createdAt).toDateString()}
              </Typography>
              <Typography variant="body2">
                Total Items: {order.products.length}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {new Intl.NumberFormat("en-NZ", {
                style: "currency",
                currency: "NZD",
                minimumFractionDigits: 2,
              }).format(order.total_order_price)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* <Box sx={{ flexGrow: 1 }} /> */}

      <Box
        sx={{
          py: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<ArticleIcon />}
          sx={{ marginRight: "5px" }}
          onClick={() => navigate(`/account/orders/${order._id}`)}
        >
          {" "}
          View
        </Button>
        <SendMessageButton variant="outlined" stall={stall} user={user} />
      </Box>
    </Card>
  );
};

export default OrderCard;
