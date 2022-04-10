import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Grid, Button } from "@mui/material";

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
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setDetailsButton(
      "/account/myaccount" === currentPage ? "contained" : "outlined"
    );
    setMyStallsButton(
      "/account/stalls/mystalls" === currentPage ? "contained" : "outlined"
    );
    setMyProductsButton(
      "/account/products/myproducts" === currentPage ? "contained" : "outlined"
    );
    setMyOrdersButton(
      "/account/orders/myorders" === currentPage ? "contained" : "outlined"
    );
    setOrdersReceivedButton(
      "/account/orders/received" === currentPage ? "contained" : "outlined"
    );
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(window.location.href.split("http://localhost:3000")[1]);
  }, []);

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
              setCurrentPage("/account/myaccount");
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
              setCurrentPage("/account/myaccount");
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
              setCurrentPage("/account/stalls/mystalls");
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
              setCurrentPage("/account/stalls/mystalls");
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
              setCurrentPage("/account/products/myproducts");
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
              setCurrentPage("/account/products/myproducts");
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
              setCurrentPage("/account/orders/myorders");
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
              setCurrentPage("/account/orders/myorders");
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
            onClick={() => {
              setCurrentPage("/account/orders/received");
              navigate("orders/received");
            }}
          >
            Orders Received
          </Button>
        </Grid>
        <Grid item display={{ xs: "block", md: "none" }}>
          <Button
            size="small"
            variant={ordersReceivedButton}
            onClick={() => {
              setCurrentPage("/account/orders/received");
              navigate("orders/received");
            }}
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
