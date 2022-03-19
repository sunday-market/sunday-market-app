import React from "react";
import { Outlet, useNavigate } from "react-router";

import { Box, Grid, Button} from "@mui/material";

import {
  PersonOutlined as AccountDetailsIcon,
  StorefrontOutlined as MyStallsIcon,
  Inventory2Outlined as MyProductsIcon,
  ReceiptLongOutlined as MyOrdersIcon,
  ReceiptOutlined as OrdersReceivedIcon,
} from "@mui/icons-material";

const AccountPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Account Controls  */}
      <Grid
        container
        spacing={1}
        justifyContent="center"
        pb={1}
        backgroundColor="white"
        border="solid 1px #c3c3c3"
      >
        {/* Account Details Button */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant="outlined"
            startIcon={<AccountDetailsIcon />}
            onClick={() => navigate("myaccount")}
          >
            Details
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("myaccount")}
          >
            <AccountDetailsIcon />
          </Button>
        </Grid>

        {/* My Stalls Button  */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant="outlined"
            startIcon={<MyStallsIcon />}
            onClick={() => navigate("mystalls")}
          >
            My Stalls
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("mystalls")}
          >
            <MyStallsIcon />
          </Button>
        </Grid>

        {/* My Products Button  */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant="outlined"
            startIcon={<MyProductsIcon />}
            onClick={() => navigate("myproducts")}
          >
            My Products
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("myproducts")}
          >
            <MyProductsIcon />
          </Button>
        </Grid>

        {/* My Orders Button  */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant="outlined"
            startIcon={<MyOrdersIcon />}
            onClick={() => navigate("myorders")}
          >
            My Orders
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("myorders")}
          >
            <MyOrdersIcon />
          </Button>
        </Grid>

        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant="outlined"
            startIcon={<OrdersReceivedIcon />}
            onClick={() => navigate("ordersreceived")}
          >
            Orders Received
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("ordersreceived")}
          >
            <OrdersReceivedIcon />
          </Button>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center">
        <Box
          mt={3}
          backgroundColor="white"
          border="solid 1px #c3c3c3"
          borderRadius="5px"
          margin={1}
          padding={4}
          width="90%"
          maxWidth="1000px"
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default AccountPage;
