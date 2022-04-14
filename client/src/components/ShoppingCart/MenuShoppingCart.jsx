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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import DataContext from "../../context/DataContext";

const styles = (theme) => ({
  popoverPaper: {
    width: "50%",
    height: "80%",
    maxHeight: "unset",
    left: "5% !important",
  },
});

const MenuShoppingCart = () => {
  const {
    setError,
    shoppingCart,
    shoppingCartPriceTotal,
    selectedItems,
    handleCartClear,
    futureDate,
    deleteCart,
    createNewCart,
    handleRefresh,
  } = useContext(DataContext);
  const [anchorShopping, setAnchorShopping] = useState(null);
  const [minutes, seconds] = useCountdown(futureDate);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // navigation
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const cartRef = useRef(null);

  // timer checks
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (anchorShopping) {
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
          if (
            minutes + seconds <= 0 &&
            localStorage.getItem("shoppingCartId")
          ) {
            deleteCart();
          } else if (minutes >= 0 && minutes <= 10) {
            timerRef.current.style.color = "red";
            cartRef.current.style.color = "red";
            setTimeout(() => {
              if (cartRef && timerRef) {
                cartRef.current.style.color = "white";
                timerRef.current.style.color = "white";
              }
            }, 500);
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
    } else if (!anchorShopping) {
      // timer check
      if (minutes + seconds <= 0 && localStorage.getItem("shoppingCartId")) {
        deleteCart();
      } else if (minutes >= 0 && minutes <= 10) {
        cartRef.current.style.color = "red";
        setTimeout(() => {
          cartRef.current.style.color = "white";
        }, 500);
      } else if (minutes + seconds < 0) {
        deleteCart();
      }
    }
    return () => {
      controller.abort();
    };
  }, [anchorShopping, createNewCart, deleteCart, minutes, seconds, setError]);

  // Shopping dropdown

  const openShopping = Boolean(anchorShopping);
  const handleShoppingClick = (event) => {
    setAnchorShopping(event.currentTarget);
  };
  const handleShoppingClose = () => {
    setAnchorShopping(null);
  };

  return (
    <>
      {/* Shopping Cart */}
      <Grid item xs={3} sx={{ cursor: "pointer" }}>
        {minutes <= 10 ? (
          <ProductionQuantityLimitsOutlinedIcon
            onClick={handleShoppingClick}
            aria-controls={openShopping ? "shopping-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openShopping ? "true" : undefined}
            style={{ fontSize: 45, color: "white" }}
            ref={cartRef}
          />
        ) : (
          <ShoppingCartTwoToneIcon
            onClick={handleShoppingClick}
            aria-controls={openShopping ? "shopping-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openShopping ? "true" : undefined}
            style={{ fontSize: 45, color: "white" }}
            ref={cartRef}
          />
        )}

        <Typography
          variant="body2"
          color="white"
          display={{ xs: "none", sm: "none", md: "block" }}
        >
          ${shoppingCartPriceTotal ? shoppingCartPriceTotal : "00.00"}
        </Typography>
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
              right: 10,
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
        <Grid
          container
          item
          alignContent={"center"}
          justifyContent={"center"}
          my={0.5}
          spacing={0}
          xs={12}
          md={8}
          sx={{ maxWidth: { xs: "100%", md: 400 } }}
        >
          {selectedItems !== [] &&
            selectedItems.length === shoppingCart?.products_selected?.length &&
            shoppingCart?.products_selected?.map((product, index) => (
              <Grid
                item
                container
                alignContent={"center"}
                justifyContent={"center"}
                xs={12}
                spacing={0}
                key={index}
                my={0.5}
              >
                <Grid
                  item
                  container
                  alignContent={"center"}
                  justifyContent={"center"}
                  xs={2}
                  spacing={0}
                >
                  <Box
                    component={"img"}
                    ml={0.5}
                    mr={1}
                    sx={{ maxWidth: { xs: "100%" } }}
                    alt={"This product image of the shopping cart"}
                    src={`${PF}products/${selectedItems[index].image}`}
                  />
                </Grid>

                <Grid
                  item
                  container
                  alignContent={"center"}
                  justifyContent={"center"}
                  textAlign={"center"}
                  justifySelf="center"
                  xs={5}
                  spacing={0}
                >
                  <Typography
                    variant="body1"
                    maxWidth={"100%"}
                    style={{ overflowWrap: "break-word" }}
                  >
                    {product.product_name
                      ? product.product_name
                      : "No name for this poduct can be found"}
                  </Typography>
                </Grid>
                <Grid
                  item
                  container
                  alignContent={"center"}
                  justifyContent={"center"}
                  xs={2}
                  spacing={0}
                >
                  <Typography variant="body2">
                    QTY {product.quantity}
                  </Typography>
                </Grid>
                <Grid
                  item
                  container
                  alignContent={"center"}
                  justifyContent={"center"}
                  xs={2}
                  spacing={0}
                >
                  <Typography variant="body2">
                    ${(product.quantity * product.product_price).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
        </Grid>
        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />

        <Grid
          container
          alignContent={"center"}
          justifyContent={"center"}
          my={1}
          spacing={0}
        >
          <Grid
            item
            container
            alignContent={"center"}
            justifyContent={"center"}
            xs={12}
            spacing={0}
          >
            <Typography variant="body1">
              Estimated Total: $
              {shoppingCartPriceTotal ? shoppingCartPriceTotal : "00.00"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />

        <Grid
          container
          alignContent={"center"}
          justifyContent={"center"}
          my={1}
          spacing={0}
        >
          <Grid
            item
            container
            alignContent={"center"}
            justifyContent={"center"}
            xs={12}
            spacing={0}
          >
            <Typography
              variant="body1"
              sx={{
                color: "white",
                margin: "auto",
                textAlign: "center",
              }}
            >
              Time Remaining:
            </Typography>
          </Grid>
          <Grid
            item
            container
            alignContent={"center"}
            justifyContent={"center"}
            xs={2}
            spacing={0}
          >
            <RefreshRoundedIcon
              sx={{ margin: "auto", marginRight: 0, cursor: "pointer" }}
              onClick={handleRefresh}
            />
          </Grid>
          <Grid
            item
            container
            alignContent={"center"}
            justifyContent={"center"}
            xs={4}
          >
            <Typography
              variant="body1"
              ref={timerRef}
              sx={{
                pl: 1,
                color: "white",
                margin: "auto",
                marginLeft: 0,
              }}
            >
              {minutes}min.{seconds}sec
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
        <Grid
          container
          alignContent={"center"}
          justifyContent={"center"}
          spacing={0}
        >
          <Grid
            item
            container
            alignContent={"center"}
            justifyContent={"center"}
            xs={5}
          >
            <Button
              variant="outlined"
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                margin: 2,
                marginBottom: 0.5,
                border: 1,
                boxShadow: 2,
              }}
              onClick={handleCartClear}
            >
              Clear
            </Button>
          </Grid>
          <Grid
            item
            container
            alignContent={"center"}
            justifyContent={"center"}
            xs={7}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: 1,
                margin: 2,
                marginBottom: 0.5,
                border: 0,
                boxShadow: 2,
              }}
              onClick={() => navigate("/shoppingcart/myshoppingcart")}
            >
              View Cart
            </Button>
          </Grid>
        </Grid>
      </Menu>
    </>
  );
};

export default MenuShoppingCart;
{
  /* <Box
          container
          direction={"row"}
          justifyContent="center"
          alignContent={"center"}
          width={"100%"}
          p={0}
        >
          {selectedItems !== [] &&
            selectedItems.length === shoppingCart?.products_selected?.length &&
            shoppingCart?.products_selected?.map((product, index) => (
              <MenuItem
                sx={{ color: "white", padding: 0, ml: 1 }}
                width={{ xs: "100%", lg: "30%" }}
                p={0}
                key={index}
              >
                <Box
                  component={"img"}
                  sx={{ maxWidth: 80 }}
                  alt={"This product image of the shopping cart"}
                  src={`${PF}products/${selectedItems[index].image}`}
                />
                <Typography
                  variant="body1"
                  style={{
                    overflowWrap: "break-word",
                    maxWidth: "60% !important",
                  }}
                >
                  {product.product_name
                    ? product.product_name
                    : "No name for this poduct can be found"}
                </Typography>
                <Typography variant="body1" maxWidth={"100%"}>
                  QTY {product.quantity}
                </Typography>
                <Typography variant="body1" maxWidth={"100%"}>
                  ${(product.quantity * product.product_price).toFixed(2)}
                </Typography>
              </MenuItem>
            ))}
        </Box> */
}
