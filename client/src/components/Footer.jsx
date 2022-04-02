import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";

const Footer = ({ setError }) => {
  const [categories, setCategories] = useState();

  useEffect(() => {
    const controller = new AbortController();

    if (!categories) {
      (async () => {
        await axios
          .get("/api/category")
          .then((result) => {
            setCategories(result.data);
          })
          .catch((error) => {
            setError(error.response.data.error);
            controller.abort();
          });
      })();
    }

    return () => {
      controller.abort();
    };
  }, [categories, setError]);

  return (
    <Box component="footer" sx={{ backgroundColor: "#0288d1", color: "white" }}>
      <Grid container justifyContent="center" pt={4} textAlign="center">
        <Grid item xs={5} md={2} p={2} py={3}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Top 5 Categories
          </Typography>

          {categories &&
            categories.slice(-5).map((category) => (
              <Typography variant="body2" key={category._id}>
                <Link to={`/search/category/${category._id}`}>
                  {category.category_name}
                </Link>
              </Typography>
            ))}
        </Grid>

        <Grid item xs={5} md={2} p={2} py={3}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Orders
          </Typography>
          <Typography variant="body2">
            <Link to="/shoppingcart/myshoppingcart">Shopping Cart</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/account/orders/myorders">My Orders</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/account/orders/received">Received Orders</Link>
          </Typography>
        </Grid>

        <Grid item xs={5} md={2} p={2} py={3}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Account
          </Typography>
          <Typography variant="body2">
            <Link to="/account">My Account</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/register">Create Account</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/login">Sign Into Account</Link>
          </Typography>
        </Grid>

        <Grid item xs={5} md={2} p={2} py={3}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Customer Service
          </Typography>
          <Typography variant="body2">
            <Link to="/support">Contact Us</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/privacy">Privacy Statement</Link>
          </Typography>
        </Grid>

        <Grid item xs={12} p={3}>
          <Typography variant="body1">
            <small>Copyright &copy; 2022. Sunday Markets</small>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
