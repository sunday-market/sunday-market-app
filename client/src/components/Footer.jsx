import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";

import DataContext from "../context/DataContext";

const Footer = () => {
  const { categories } = useContext(DataContext);

  const navigate = useNavigate();

  const navigateTo = (categoryId) => {
    navigate(`${categoryId}`);
    window.scrollTo(0, 0);
  };

  return (
    <Box
      component="footer"
      mt={3}
      sx={{ backgroundColor: "#737373", color: "white" }}
    >

{/* 5f6368 */}
{/* 535353 */}
{/* 737373 */}

      <Grid container justifyContent="center" pt={1.5} textAlign="center">
        <Grid item xs={5} md={2} px={2} py={1}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Top 5 Categories
          </Typography>

          {categories &&
            categories.slice(-5).map((category) => (
              <Typography
                variant="body2"
                key={category._id}
                onClick={() => navigateTo(`/search/category/${category._id}`)}
                sx={{ cursor: "pointer" }}
              >
                {category.category_name}
              </Typography>
            ))}
        </Grid>

        <Grid item xs={5} md={2} px={2} py={1}>
          <Typography variant="body1" color="#323232" sx={{fontWeight: 700}}>
            Orders
          </Typography>
          <Typography
            variant="body2"
            color="lightGrey"
            onClick={() => navigateTo(`/shoppingcart/myshoppingcart`)}
            sx={{ cursor: "pointer" }}
          >
            Shopping Cart
          </Typography>
          <Typography
            variant="body2"
            color="lightGrey"
            onClick={() => navigateTo(`/account/orders/myorders`)}
            sx={{ cursor: "pointer" }}
          >
            My Orders
          </Typography>
          <Typography
            variant="body2"
            color="lightGrey"
            onClick={() => navigateTo(`/account/orders/received`)}
            sx={{ cursor: "pointer" }}
          >
            Received Orders
          </Typography>
        </Grid>

        <Grid item xs={5} md={2} px={2} py={1}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Account
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigateTo(`/account/`)}
            sx={{ cursor: "pointer" }}
          >
            My Account
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigateTo(`/register`)}
            sx={{ cursor: "pointer" }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigateTo(`/login`)}
            sx={{ cursor: "pointer" }}
          >
            Sign Into Account
          </Typography>
        </Grid>

        <Grid item xs={5} md={2} px={2} py={1}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Customer Service
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigateTo(`/support`)}
            sx={{ cursor: "pointer" }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigateTo(`/privacy`)}
            sx={{ cursor: "pointer" }}
          >
            Privacy Statement
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigateTo(`/terms`)}
            sx={{ cursor: "pointer" }}
          >
            Terms and Conditions
          </Typography>
        </Grid>

        <Grid item xs={12} py={1} backgroundColor="#535353" mt={1}>
          <Typography variant="body1">
            <small>Copyright &copy; 2022. Sunday Markets</small>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
