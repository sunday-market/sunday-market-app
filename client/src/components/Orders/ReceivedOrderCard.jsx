import React, {useContext} from "react";
import { useNavigate } from "react-router";
import { Typography, Card, CardContent, Box, Button } from "@mui/material";

import { Article as ArticleIcon } from "@mui/icons-material";

import { priceToCurrency } from "../../utils/currency";

const ReceivedOrderCard = ({ order }) => {
  const navigate = useNavigate();

  const getTotalOrderPrice = () => {
    let sum = 0;
    for (let i = 0; i < order.products.length; i++) {
      sum += order.products[i].quantity * order.products[i].price;
    }
    return priceToCurrency(sum);
  };

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
                {getTotalOrderPrice()}
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
