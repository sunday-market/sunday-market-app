import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  InputLabel,
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
  const [shoppingCartId, setShoppingCartId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

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

  return (
    <>
      <Box p={2}>
        <Typography p={3} variant="h4">
          My Shopping Cart
        </Typography>
        {/* Grid item is shopping cart item */}
        <Grid container direction={"column"} spacing={0}>
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
            boxShadow={2}
            bgcolor="blueGrey.50"
          >
            <Box
              component="img"
              maxHeight={100}
              height="30px"
              width={30}
              bgcolor={"black"}
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            p={1.5}
            mr={2}
            boxShadow={2}
            bgcolor={"red"}
          >
            <Box
              component="img"
              maxHeight={100}
              height="30px"
              width={30}
              bgcolor={"black"}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
