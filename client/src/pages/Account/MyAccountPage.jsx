import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Box, Grid, Button } from "@mui/material";

import {
  PersonOutlined as AccountDetailsIcon,
  StorefrontOutlined as MyStallsIcon,
  Inventory2Outlined as MyProductsIcon,
  ReceiptLongOutlined as MyOrdersIcon,
  ReceiptOutlined as OrdersReceivedIcon,
} from "@mui/icons-material";

import PageContainer from "../../components/PageContainer";

const AccountPage = () => {
  const navigate = useNavigate();
  const [detailsButton, setDetailsButton] = useState("outlined");
  const [myStallsButton, setMyStallsButton] = useState("outlined");
  const [myProductsButton, setMyProductsButton] = useState("outlined");
  const [myOrdersButton, setMyOrdersButton] = useState("outlined");
  const [ordersReceivedButton, setOrdersReceivedButton] = useState("outlined");

  useEffect(() => {
    setDetailsButton(
      window.location.pathname === "/account/myaccount"
        ? "contained"
        : "outlined"
    );
    setMyStallsButton(
      window.location.pathname === "/account/stalls/mystalls"
        ? "contained"
        : "outlined"
    );
    setMyProductsButton(
      window.location.pathname === "/account/products/myproducts"
        ? "contained"
        : "outlined"
    );
    setMyOrdersButton(
      window.location.pathname === "/account/orders/myorders"
        ? "contained"
        : "outlined"
    );
    setOrdersReceivedButton(
      window.location.pathname === "/account/orders/ordersreceived"
        ? "contained"
        : "outlined"
    );
  });

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
            variant={detailsButton}
            startIcon={<AccountDetailsIcon />}
            onClick={() => {
              navigate("myaccount");
            }}
          >
            Details
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant={detailsButton}
            onClick={() => {
              navigate("myaccount");
            }}
          >
            <AccountDetailsIcon />
          </Button>
        </Grid>

        {/* My Stalls Button  */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant={myStallsButton}
            startIcon={<MyStallsIcon />}
            onClick={() => {
              navigate("stalls/mystalls");
            }}
          >
            My Stalls
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant={myStallsButton}
            onClick={() => {
              navigate("stalls/mystalls");
            }}
          >
            <MyStallsIcon />
          </Button>
        </Grid>

        {/* My Products Button  */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant={myProductsButton}
            startIcon={<MyProductsIcon />}
            onClick={() => {
              navigate("products/myproducts");
            }}
          >
            My Products
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant={myProductsButton}
            onClick={() => {
              navigate("products/myproducts");
            }}
          >
            <MyProductsIcon />
          </Button>
        </Grid>

        {/* My Orders Button  */}
        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant={myOrdersButton}
            startIcon={<MyOrdersIcon />}
            onClick={() => {
              navigate("orders/myorders");
            }}
          >
            My Orders
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant={myOrdersButton}
            onClick={() => {
              navigate("orders/myorders");
            }}
          >
            <MyOrdersIcon />
          </Button>
        </Grid>

        <Grid item display={{ xs: "none", md: "block" }}>
          <Button
            variant={ordersReceivedButton}
            startIcon={<OrdersReceivedIcon />}
            onClick={() => navigate("orders/ordersreceived")}
          >
            Orders Received
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant={ordersReceivedButton}
            onClick={() => navigate("orders/ordersreceived")}
          >
            <OrdersReceivedIcon />
          </Button>
        </Grid>
      </Grid>

      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
};

export default AccountPage;
