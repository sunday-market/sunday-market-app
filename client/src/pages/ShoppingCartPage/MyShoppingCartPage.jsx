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
import { useCountdown } from "../../hooks/useCountdown";

export default function MyShoppingCartPage() {
  const [shoppingCart, setShoppingCart] = useState(null);
  const [shoppingCartPriceTotal, setShoppingCartPriceTotal] = useState();
  const [shoppingCartId, setShoppingCartId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState("");
  const [createCart, setCreateCart] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [futureDate, setFutureDate] = useState(
    new Date().getTime() + 30 * 60000
  );

  const [days, hours, minutes, seconds] = useCountdown(futureDate);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // navigation
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const timerRef = useRef(null);
  const orderNoteRef = useRef(null);

  useEffect(() => {
    let minutesToAdd = 30;
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
          const cart = await (
            await axios.get(`/api/cart/${cartId}`, config)
          )?.data[0];
          if (cart === undefined || cart === null) {
            localStorage.removeItem("shoppingCartId");
            return createNewCart();
          }

          // if cart is length 0 then the cart either doesn't exist anymore or is empty either way safe to recreate
          if (cart?.products_selected.length === 0 || !cart) {
            let res = await axios.delete(`/api/cart/${cartId}`);
            console.log(res);
            return createNewCart();
          }
          // Cart has items still that haven't been erased in timeout so set the cart equal to this
          else {
            setShoppingCart(cart);
            setCartLoaded(true);
            const currentDate =
              new Date(cart.updatedAt).getTime() +
              minutesToAdd * 60000 -
              new Date().getTime();
            if (currentDate <= 0) {
              deleteCart();
            } else {
              setFutureDate(
                new Date(cart.updatedAt).getTime() + minutesToAdd * 60000
              );
            }
          }
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
    const checkTimer = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      let cartId;
      let cart;
      // check for cart still existing in the database
      if (localStorage.getItem("shoppingCartId")) {
        cartId = localStorage.getItem("shoppingCartId");
        cart = await (await axios.get(`/api/cart/${cartId}`, config))?.data[0];
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
    };
    checkTimer();
    return () => {
      controller.abort();
    };
  }, [minutes, seconds]);

  useEffect(() => {
    const recreateCart = async () => {
      if (!localStorage.getItem("shoppingCartId") && createCart) {
        createNewCart();
      }
    };
    recreateCart();
  }, [createCart]);

  // is user logged in and has a shopping cart
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (localStorage.getItem("authToken") && cartLoaded) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      const loadUserIdToCart = async () => {
        // get auth token and check if valid
        const jwt = jwtDecode(localStorage.getItem("authToken"));
        console.log(jwt);
        try {
          let res = await axios.get(`/api/user/exists/${jwt.id}`);
          // if shopping cart === undefined then no user has been added to this shopping cart - if res is true procceed else if res is false delete token
          if (
            (shoppingCart?.user === undefined || shoppingCart?.user === null) &&
            res &&
            shoppingCartId
          ) {
            // put user in data
            const newCartData = {
              user: jwt.id,
              shoppingCart,
            };
            res = await axios.put(
              `/api/cart/${shoppingCartId}`,
              newCartData,
              config
            );
            // user doesn't exist
          } else if (res === false) {
            setTimeout(() => {
              setError("");
              localStorage.removeItem("authToken");
              controller.abort();
              return navigate("/login");
            }, 5000);
            errorRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            return setError(
              "Bad Authentication! your user doesn't appear to exist, you'll be redirected to login, please login and try again!"
            );
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log(error);
            return console.log("Successfully Aborted");
          }
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
      loadUserIdToCart();
    }
    return () => {
      controller.abort();
    };
  }, [cartLoaded, navigate, shoppingCart, shoppingCartId]);

  async function deleteCart() {
    let cartid = localStorage.getItem("shoppingCartId");
    await axios.put("/api/cart/clearcart/" + cartid);
    await axios.delete(`/api/cart/${cartid}`);
    setShoppingCartId("");
    setCartLoaded(false);
    setShoppingCart(null);
    setShoppingCartPriceTotal(null);
    setSelectedItems([]);
    localStorage.removeItem("shoppingCartId");
    setCreateCart(true);
  }

  const createNewCart = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    let minutesToAdd = 30;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    };
    const newCartId = await (
      await axios.post("/api/cart/", config)
    ).data.data._id;
    const cart = await (
      await axios.get(`/api/cart/${newCartId}`, config)
    ).data[0];
    // set current date to time the cart was last updated
    const currentDate = new Date(cart.updatedAt);
    // set countdown date
    setFutureDate(new Date(currentDate.getTime() + minutesToAdd * 60000));
    // set shopping cart and load time
    setShoppingCart(cart);
    setCartLoaded(true);
    setShoppingCartId(newCartId);
    localStorage.setItem("shoppingCartId", newCartId);
    setCreateCart(false);
    controller.abort();
  };

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
    const controller = new AbortController();
    const signal = controller.signal;
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
        if (axios.isCancel(error)) {
          console.log(error);
          return console.log("Successfully Aborted");
        }
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
    const loopThroughCart = () => {
      shoppingCart.products_selected.forEach((product) => {
        setProductInfo(product.product_id);
      });
    };
    if (shoppingCart?.products_selected?.length > 0) {
      loopThroughCart();
    }

    return () => {
      controller.abort();
    };
  }, [shoppingCart]);

  // Handle cart clear
  const handleCartClear = async () => {
    try {
      console.log("clear cart");
      await axios.put("/api/cart/clearcart/" + shoppingCart._id);
      setCartLoaded(false);
      setShoppingCart();
      setShoppingCartPriceTotal();
      setSelectedItems([]);
      let minutesToAdd = 30;
      const currentDate = new Date();
      setFutureDate(new Date(currentDate.getTime() + minutesToAdd * 60000));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    console.log("test");
    let minutesToAdd = 30;
    try {
      const cartId = localStorage.getItem("shoppingCartId");
      const cart = (await axios.get(`/api/cart/${cartId}`)).data[0];
      const res = await axios.put(`/api/cart/${cartId}`, cart);
      const currentDate = new Date(res.data.data[0].updatedAt);
      setFutureDate(new Date(currentDate.getTime() + minutesToAdd * 60000));
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
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return setError("Your Cart doesn't appear to exist anymore.");
    }
    // check id returns a valid cart
    else {
      cartId = localStorage.getItem("shoppingCartId");
      try {
        cart = await (await axios.get(`/api/cart/${cartId}`)).data[0];
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
    }
    if (!cart) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return setError(
        "Your Cart ID doesn't Match any cart in the database try refreshing your page or add items to the cart, if the problem persists please contact the support team"
      );
    }
    console.log(cart);

    // check cart length
    if (cart.products_selected.length === 0) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

        setTimeout(() => {
          setError("");
        }, 5000);
        errorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return setError(error.response.data.error);
      }

      // delete shopping cart and keep product qtys the same and minused
      await axios.delete(`/api/cart/${cartId}`);
      localStorage.removeItem("shoppingCartId");

      // navigate the user to a my order page
      return navigate("/account/orders/myorders");
    }
  };

  return (
    <>
      <Box p={2} boxShadow={1} m={2} bgcolor="grey.A200">
        <Box p={2} ref={errorRef}>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>

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
