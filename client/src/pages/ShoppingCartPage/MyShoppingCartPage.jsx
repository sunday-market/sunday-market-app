import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Replay30Icon from "@mui/icons-material/Replay30";
import {
  Grid,
  InputLabel,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  Alert,
  Button,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useCountdown } from "../../hooks/useCountdown";

import DataContext from "../../context/DataContext";

export default function MyShoppingCartPage() {
  const {
    setError,
    setLoading,
    shoppingCart,
    setShoppingCart,
    shoppingCartPriceTotal,
    setShoppingCartPriceTotal,
    shoppingCartId,
    setShoppingCartId,
    selectedItems,
    setSelectedItems,
    handleCartClear,
    setCreateCart,
    cartLoaded,
    setCartLoaded,
    futureDate,
    setFutureDate,
    deleteCart,
    createNewCart,
    handleRefresh,
  } = useContext(DataContext);

  const [minutes, seconds] = useCountdown(futureDate);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // navigation
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const orderNoteRef = useRef(null);

  // timer checks
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const checkTimer = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      let cartId;
      let cart;
      try {
        // check for cart still existing in the database
        if (localStorage.getItem("shoppingCartId")) {
          cartId = localStorage.getItem("shoppingCartId");
          cart = await (
            await axios.get(`/api/cart/${cartId}`, config)
          )?.data[0];
        }
        if (cart === undefined || cart === null) {
          // if null or undefined the cart no longer exists
          localStorage.removeItem("shoppingCartId");
          createNewCart();
        }
        // timer check
        if (minutes + seconds <= 0 && localStorage.getItem("shoppingCartId")) {
          deleteCart();
        } else if (minutes >= 0 && minutes <= 10) {
          timerRef.current.style.color = "red";
        } else if (minutes >= 10) {
          timerRef.current.style.color = "green";
        } else if (minutes + seconds < 0) {
          deleteCart();
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        return setError([error]);
      }
    };
    checkTimer();
    return () => {
      controller.abort();
    };
  }, [createNewCart, deleteCart, minutes, seconds, setError]);


  const handlePurchase = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    let cart;
    let cartId;
    console.log("Purchase Pressed");
    // check local storage id
    if (!localStorage.getItem("shoppingCartId")) {
      return setError("Your Cart doesn't appear to exist anymore.");
    }
    // check id returns a valid cart
    else {
      cartId = localStorage.getItem("shoppingCartId");
      try {
        cart = await (await axios.get(`/api/cart/${cartId}`)).data[0];
      } catch (error) {
        return setError([error]);
      }
    }
    if (!cart) {
      return setError(
        "Your Cart ID doesn't Match any cart in the database try refreshing your page or add items to the cart, if the problem persists please contact the support team"
      );
    }
    console.log(cart);

    // check cart length
    if (cart.products_selected.length === 0) {
      return setError("Your Cart doesn't have any items in it!");
    }
    // update cart to avoid any possible deletion
    await axios.put(`/api/cart/${cartId}`, cart);

    // check user logged in - log user in if not
    if (!localStorage.getItem("authToken")) {
      // user has no auth token so not logged in
      setTimeout(() => {
        setError("");
        navigate("/login");
      }, 5000);

      return setError(
        "You are not logged in! Redirecting you to the Login Page, don't worry your cart is safe and valid for another 30minutes."
      );
    }
    // if user logged in complete purchase creation (new transaction document)
    else {
      // TODO
      try {
        const user_id = jwtDecode(localStorage.getItem("authToken"));
        const customer_id = user_id.id;
        const user = await (
          await axios.get("/api/user/" + customer_id, config)
        ).data.data;
        // create transaction
        const transaction = await (
          await axios.post("/api/transaction/", { customer_id }, config)
        ).data.data;
        const transaction_id = transaction._id;
        // create a const holding all stall and product details
        const completeCartWithProductStalls = await (
          await axios.post(`/api/cart/processpurchase/${cartId}`, cart, config)
        ).data.data[0];

        let orders = [];
        for (const stall of completeCartWithProductStalls.stalls) {
          // create products array for order
          let products = [];
          let orderTotal = 0;
          completeCartWithProductStalls.products.forEach((product) => {
            if (stall._id === product.product_stall) {
              completeCartWithProductStalls.products_selected.forEach(
                (selected) => {
                  if (product._id === selected.product_id) {
                    products.push({
                      id: product._id,
                      name: product.product_name,
                      description: product.product_description,
                      category: product.product_subcategory,
                      price: product.product_price,
                      quantity: selected.quantity,
                    });
                    orderTotal += product.product_price * selected.quantity;
                  }
                }
              );
            }
          });
          // Create New Order
          let newOrder = {
            transaction_id,
            stall: {
              id: stall._id,
              name: stall.stallName,
              category_id: stall.category,
              email: stall.email,
              location: stall.city_location,
              image: stall.image,
            },
            customer: {
              id: customer_id,
              name: user.fullname,
              email: user.email,
            },
            products,
            order_notes: orderNoteRef.current.value,
            total_order_price: orderTotal.toFixed(2),
          };
          console.log(newOrder);
          let resNewOrder = await axios.post("/api/order/", newOrder, config);
          orders.push(resNewOrder.data.data);
        }
        // add orders to transaction
        console.log({ transaction, orders });
        const res = await axios.put(
          `/api/transaction/update/${transaction_id}`,
          { transaction, orders },
          config
        );
        console.log(res);
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          return navigate("/login");
        }

        return setError([error]);
      }
      setShoppingCartId("");
      setCartLoaded(false);
      setShoppingCart(null);
      setShoppingCartPriceTotal(null);
      setSelectedItems([]);
      // delete shopping cart and keep product qtys the same and minused
      await axios.delete(`/api/cart/${cartId}`);
      localStorage.removeItem("shoppingCartId");
      setCreateCart(true);
      // navigate the user to a my order page
      return navigate("/account/orders/myorders");
    }
  };

  return (
    <>
      <Box p={2} boxShadow={1} m={2} bgcolor="grey.A200">
        <Typography p={3} variant="h4">
          My Shopping Cart
        </Typography>
        {/* Grid item is shopping cart item */}
        <Grid container direction={"column"} spacing={0}>
          {selectedItems !== [] &&
            selectedItems.length === shoppingCart?.products_selected.length &&
            shoppingCart?.products_selected.map((product, index) => {
              return (
                <Grid
                  key={index}
                  container
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  p={1.5}
                  mr={2}
                  mb={2}
                  spacing={0}
                  boxShadow={2}
                  bgcolor="blueGrey.50"
                >
                  <Grid
                    container
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    justifyContent="center"
                    alignContent={"center"}
                  >
                    <Typography variant="h5">{product.product_name}</Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={6}
                    sm={4}
                    md={2.5}
                    alignContent={"center"}
                  >
                    <Box
                      component="img"
                      height={"100%"}
                      width={"100%"}
                      src={`${PF}products/${selectedItems[index].image}`}
                      alt={""}
                    />
                  </Grid>
                  <Grid
                    container
                    item
                    order={{ xs: 2, md: 1 }}
                    xs={12}
                    md={7.5}
                    alignContent={"center"}
                  >
                    <Typography
                      color="textPrimary"
                      variant="body2"
                      p={1}
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        display: "-webkit-box !important",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.product_description
                        ? product.product_description
                        : "No Description for this product"}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    order={{ xs: 1, md: 2 }}
                    xs={6}
                    md={2}
                    alignContent={"center"}
                    flexGrow={1}
                    justifyContent={"flex-end"}
                    justifySelf={"end"}
                  >
                    <Typography
                      p={{ xs: 0.5, lg: 3 }}
                      color="textPrimary"
                      variant="body2"
                    >
                      QTY: {product.quantity}
                    </Typography>

                    <Typography
                      p={{ xs: 0.5, lg: 3 }}
                      color="textPrimary"
                      variant="body2"
                    >
                      ${(product.product_price * product.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
        <Grid container justifyContent={"flex-end"} spacing={0}>
          <Grid
            container
            item
            order={{ xs: 1, md: 2 }}
            xs={12}
            sm={8}
            md={4}
            marginTop={{ xs: 2, sm: 1 }}
            spacing={0}
            boxShadow={2}
            flexShrink={1}
            justifyContent="center"
          >
            <Grid item xs={12} alignContent={"center"}>
              <TextField
                ref={orderNoteRef}
                placeholder="Enter Any Order Notes..."
                fullWidth
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent={"flex-end"} spacing={0}>
          <Grid
            container
            item
            order={{ xs: 1, md: 2 }}
            xs={12}
            sm={8}
            md={4}
            marginTop={{ xs: 2, sm: 1 }}
            spacing={0}
            boxShadow={2}
            flexShrink={1}
            justifyContent="center"
            bgcolor="blueGrey.50"
            ref={timerRef}
            color="green"
          >
            <Grid
              item
              order={{ xs: 1, md: 2 }}
              xs={1.5}
              ml={1}
              alignContent={"center"}
            >
              <IconButton onClick={handleRefresh}>
                <Replay30Icon fontSize="large" />
              </IconButton>
            </Grid>
            <Grid
              item
              container
              order={{ xs: 1, md: 2 }}
              xs={10}
              p={1}
              alignContent={"center"}
              justifyContent="start"
            >
              <Typography>
                Time Remaining: {minutes}min.{seconds}sec
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            item
            order={{ xs: 1, md: 2 }}
            xs={12}
            sm={8}
            md={5}
            spacing={0}
            flexShrink={1}
          ></Grid>
          <Grid
            container
            item
            order={{ xs: 1, md: 2 }}
            marginTop={{ xs: 2, sm: 1 }}
            xs={12}
            sm={8}
            md={3}
            alignContent={"center"}
            justifyContent={"flex-end"}
            justifySelf={"end"}
            spacing={0}
            boxShadow={2}
            flexShrink={1}
            bgcolor="blueGrey.50"
          >
            <Grid
              item
              order={{ xs: 1, md: 2 }}
              xs={6}
              p={1}
              alignContent={"center"}
              justifyContent={"flex-end"}
              justifySelf={"end"}
            >
              <Typography textAlign="end">Price Total:</Typography>
            </Grid>
            <Grid
              item
              order={{ xs: 1, md: 2 }}
              xs={6}
              p={1}
              alignContent={"center"}
              justifyContent={"flex-end"}
              justifySelf={"end"}
            >
              <Typography textAlign="end">
                ${shoppingCartPriceTotal ? shoppingCartPriceTotal : "0.00"}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            item
            order={{ xs: 1, md: 2 }}
            marginTop={{ xs: 2, sm: 1 }}
            xs={12}
            sm={8}
            md={3}
            alignContent={"center"}
            justifyContent="center"
            spacing={0}
            flexShrink={1}
          >
            <Grid
              item
              container
              order={{ xs: 1, md: 2 }}
              xs={12}
              sm={6}
              p={1}
              alignContent={"center"}
              justifyContent="center"
            >
              <Button variant="outlined" fullWidth onClick={handleCartClear}>
                Clear
              </Button>
            </Grid>
            <Grid
              item
              container
              order={{ xs: 1, md: 2 }}
              xs={12}
              sm={6}
              p={1}
              justifyContent="center"
              alignContent={"center"}
            >
              <Button variant="contained" fullWidth onClick={handlePurchase}>
                Purchase
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
