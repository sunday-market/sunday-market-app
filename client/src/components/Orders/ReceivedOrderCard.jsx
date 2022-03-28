import React from "react";
import { useNavigate } from "react-router";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
} from "@mui/material";

import {
  Article as ArticleIcon,
  Message as MessageIcon,
} from "@mui/icons-material";

const ReceivedOrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "solid 1px #eeeeee",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography>
            <strong>Customer</strong>
          </Typography>
          <Typography variant="body1">{order.customer.name}</Typography>
          <Typography variant="body1" mb={2}>
            {order.customer.email}
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">
                <strong>Order Date:</strong>
                <br />
                {new Date(order.createdAt).toDateString()}
              </Typography>
              <Typography variant="body2" mt={1}>
                <strong>Total Items: </strong> {order.products.length}
              </Typography>
            </Box>
            <Box
              p={1}
              sx={{
                border: "solid 1px #e0e0e0",
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
              }}
            >
              <Typography>Order Total</Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
                align="center"
              >
                {new Intl.NumberFormat("en-NZ", {
                  style: "currency",
                  currency: "NZD",
                  minimumFractionDigits: 2,
                }).format(order.total_order_price)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>

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
          onClick={() => navigate(`/account/orders/received/${order._id}`)}
        >
          View Order
        </Button>
      </Box>
    </Card>
  );
};

export default ReceivedOrderCard;
