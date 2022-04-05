import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined"; // This is for when a timer on the cart is going to run out
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";

import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MenuShoppingCart() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [categories, setCategories] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [shoppingCart, setShoppingCart] = useState();
  const [shoppingCartPriceTotal, setShoppingCartPriceTotal] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

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
          if (cart?.products_selected?.length === 0) {
            await axios.delete(`/api/cart/${cartId}`);
            const shoppingCartId = (await axios.post("/api/cart/", config)).data
              .data._id;
            localStorage.setItem("shoppingCartId", shoppingCartId);
            const cart = (
              await axios.get(`/api/cart/${shoppingCartId}`, config)
            ).data[0];
            setShoppingCart(cart);
            setCartLoaded(true);
          }
          // Cart has items still that haven't been erased in timeout so set the cart equal to this
          else {
            setShoppingCart(cart);
            setCartLoaded(true);
          }
        } catch (error) {
          // error has occured
          return error;
        }
      }
      // if shopping cart doesn't exist then create one
      else {
        try {
          const shoppingCartId = (await axios.post("/api/cart/", config)).data
            .data._id;
          localStorage.setItem("shoppingCartId", shoppingCartId);
          const cart = (await axios.get(`/api/cart/${shoppingCartId}`, config))
            .data[0];
          setShoppingCart(cart);
          setCartLoaded(true);
        } catch (error) {
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
    const controller = new AbortController();
    const signal = controller.signal;
    if (cartLoaded) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      const setProductInfo = async (productID) => {
        try {
          const res = await axios.get("/api/product/" + productID, config);
          setSelectedItems((prev) => [...prev, res.data[0]]);
        } catch (error) {
          return;
        }
      };
      const loopThroughCart = () => {
        shoppingCart?.products_selected?.forEach((product) => {
          setProductInfo(product.product_id);
        });
      };
      if (shoppingCart?.products_selected?.length > 0) {
        loopThroughCart();
      }
    }
    return () => {
      controller.abort();
    };
  }, [cartLoaded, shoppingCart]);

  useEffect(() => {
    if (shoppingCart) {
      let total = 0;
      shoppingCart?.products_selected?.forEach((product) => {
        total += product.product_price * product.quantity;
      });
      setShoppingCartPriceTotal(total.toFixed(2));
    }
  }, [shoppingCart]);




  // Shopping dropdown
  const [anchorShopping, setAnchorShopping] = useState(null);
  const openShopping = Boolean(anchorShopping);
  const handleShoppingClick = (event) => {
    setAnchorShopping(event.currentTarget);
  };
  const handleShoppingClose = () => {
    setAnchorShopping(null);
  };

  // navigate to click handler functions
  const navigate = useNavigate();


  // Handle cart clear
  const handleCartClear = async () => {
    try {
      console.log("clear cart");
      await axios.put("/api/cart/clearcart/" + shoppingCart._id);
      setCartLoaded(false);
      setShoppingCart();
      setShoppingCartPriceTotal();
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* Shopping Cart */}
      <Grid
        item
        justifyContent={"center"}
        alignContent={"center"}
        sx={{
          margin: 0,
          bgcolor: "#0288d1",
          borderRadius: 2,
          maxHeight: 60,
        }}
      >
        <IconButton
          sx={{ margin: 1 }}
          onClick={handleShoppingClick}
          aria-controls={openShopping ? "shopping-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openShopping ? "true" : undefined}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: "white",
              pr: 3.5,
              margin: 0,
            }}
          >
            ${shoppingCartPriceTotal ? shoppingCartPriceTotal : "00.00"}
          </Typography>
          <ShoppingCartTwoToneIcon
            sx={{
              transform: "scale(1.6)",
              color: "#eceff1",
              margin: "auto",
            }}
          />
        </IconButton>
      </Grid>
      <Menu
        anchorEl={anchorShopping}
        id="shopping-menu"
        open={openShopping}
        onClose={handleShoppingClose}
        onClick={handleShoppingClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            bgcolor: "#03a9f4",
            boxShadow: 5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "#03a9f4",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {selectedItems !== [] &&
          selectedItems.length === shoppingCart?.products_selected?.length &&
          shoppingCart?.products_selected?.map((product, index) => (
            <Box
              container
              direction={"row"}
              justifyContent="center"
              alignContent={"center"}
              width={"100%"}
              key={index}
            >
              <MenuItem sx={{ color: "white" }} width={"100%"}>
                <Box
                  component={"img"}
                  sx={{ maxHeight: 60, maxWidth: 80 }}
                  alt={"This product image of the shopping cart"}
                  src={`${PF}products/${selectedItems[index].image}`}
                />
                <Typography paddingLeft={2} sx={{ width: "100%" }}>
                  {product.product_name
                    ? product.product_name
                    : "No name for this poduct can be found"}
                </Typography>
                <Typography paddingLeft={2}>QTY {product.quantity}</Typography>
                <Typography paddingLeft={2}>
                  ${(product.quantity * product.product_price).toFixed(2)}
                </Typography>
              </MenuItem>
            </Box>
          ))}
        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />

        <Typography>
          Estimated Total: $
          {shoppingCartPriceTotal ? shoppingCartPriceTotal : "00.00"}
        </Typography>
        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
        <Box
          container
          direction={"row"}
          justifyContent="center"
          alignContent={"center"}
          sx={{
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "white",
              margin: "auto",
              textAlign: "center",
            }}
          >
            Time Remaining:
          </Typography>
          <Box
            justifyContent="center"
            alignContent={"center"}
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <IconButton sx={{ margin: "auto", marginRight: 0 }}>
              <RefreshRoundedIcon />
            </IconButton>
            <Typography
              sx={{
                pl: 1,
                color: "white",
                margin: "auto",
                marginLeft: 0,
              }}
            >
              00.00.00s
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
        <Box
          justifyContent="center"
          alignContent={"center"}
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              margin: 2,
              marginBottom: 0.5,
              border: 1,
              boxShadow: 2,
            }}
            onClick={handleCartClear}
          >
            Clear
          </Button>
          <Box width={"10%"} />
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              margin: 2,
              marginBottom: 0.5,
              border: 0,
              boxShadow: 2,
            }}
            onClick={() => navigate("/shoppingcart/myshoppingcart")}
          >
            View Cart
          </Button>
        </Box>
      </Menu>
    </>
  );
}
