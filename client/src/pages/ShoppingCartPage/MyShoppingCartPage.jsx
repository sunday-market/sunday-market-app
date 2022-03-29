import { useEffect, useRef, useState } from "react";
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

export default function MyShoppingCartPage() {
  const [shoppingCart, setShoppingCart] = useState(null);
  const [shoppingCartPriceTotal, setShoppingCartPriceTotal] = useState();
  const [shoppingCartId, setShoppingCartId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState("");

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // navigation
  const navigate = useNavigate();
  const errorRef = useRef(null);

  // store shopping cart id in local storage for data preseverance,
  // create one if not already assigned
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getShoppingCart = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      // if exists try and get cart, or create new one if cart no longer exists
      if (localStorage.getItem("shoppingCartId")) {
        try {
          const cartId = localStorage.getItem("shoppingCartId");
          const cart = (await axios.get(`/api/cart/${cartId}`, config)).data[0];
          // if cart is length 0 then the cart either doesn't exist anymore or is empty either way safe to recreate
          if (cart.products_selected.length === 0) {
            await axios.delete(`/api/cart/${cartId}`, config);
            const shoppingCartId = (await axios.post("/api/cart/", config)).data
              .data._id;
            localStorage.setItem("shoppingCartId", shoppingCartId);
            const cart = (
              await axios.get(`/api/cart/${shoppingCartId}`, config)
            ).data.data;
            setShoppingCart(cart);
          }
          // Cart has items still that haven't been erased in timeout so set the cart equal to this
          else {
            setShoppingCart(cart);
          }
        } catch (error) {
          // error has occured
          return error;
        }
      }
    };
    getShoppingCart();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (shoppingCart) {
      let total = 0;
      shoppingCart.products_selected.forEach((product) => {
        total += product.product_price * product.quantity;
      });
      setShoppingCartPriceTotal(total.toFixed(2));
    }
  }, [shoppingCart]);

  useEffect(() => {
    if (shoppingCart) {
      const setProductInfo = async (productID) => {
        try {
          const res = await axios.get("/api/product/" + productID);
          setSelectedItems((prev) => [...prev, res.data]);
        } catch (error) {
          setTimeout(() => {
            setError("");
          }, 5000);
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return setError(error.response.data.error);
        }
      };
      shoppingCart.products_selected.forEach((product) => {
        setProductInfo(product.product_id);
      });
    }
  }, [shoppingCart]);

  return (
    <>
      <Box p={2} boxShadow={1} m={2} bgcolor="grey.A200">
        {error && (
          <Box p={2} ref={errorRef}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
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
            bgcolor="blueGrey.50"
          >
            <Grid
              item
              order={{ xs: 1, md: 2 }}
              xs={1.5}
              ml={1}
              alignContent={"center"}
            >
              <IconButton>
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
              <Typography>Time Remaining: 00.00.00</Typography>
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
                ${shoppingCartPriceTotal ? shoppingCartPriceTotal : "00.00"}
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
              <Button variant="outlined" fullWidth>
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
              <Button variant="contained" fullWidth>
                Purchase
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
