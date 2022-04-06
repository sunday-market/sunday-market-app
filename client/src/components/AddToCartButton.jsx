import { useEffect, useState, useContext } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";
import axios from "axios";

import {
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  ButtonGroup,
} from "@mui/material";

import DataContext from "../context/DataContext";

const AddToCartButton = ({ product }) => {
  const [request, setRequest] = useState(false);
  const [isUserProduct, setIsUserProduct] = useState(false);
  const [counter, setCounter] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(0);

  const { shoppingCart, setUpdateCart, setError, createNewCart } =
    useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (shoppingCart?.products_selected.length > 0) {
      shoppingCart?.products_selected?.forEach((prod) => {
        if (prod.product_id === product._id) {
          setCounter(prod.quantity);
        }
      });
    } else {
      setQuantityInStock(product.quantity_in_stock);
      setCounter(0);
    }
  }, [product._id, product.quantity_in_stock, shoppingCart]);

  const incrementQuantity = async () => {
    setRequest(true);

    const controller = new AbortController();
    let cartId = localStorage.getItem("shoppingCartId");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };

    if (!cartId) {
      await createNewCart();
      cartId = localStorage.getItem("shoppingCartId");
    }

    await axios
      .post(`/api/cart/additem/${cartId}`, product, config)
      .then(() => {
        setCounter(counter + 1);
        setQuantityInStock(quantityInStock - 1);
        setUpdateCart(true);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setRequest(false);
        setError([error]);
      });

    setRequest(false);
    return controller.abort();
  };

  const decrementQuantity = async () => {
    setRequest(true);
    const controller = new AbortController();

    let cartId = localStorage.getItem("shoppingCartId");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
      data: {
        _id: product._id,
      },
    };

    if (!cartId) {
      await createNewCart();
      cartId = localStorage.getItem("shoppingCartId");
    }

    await axios
      .delete(`/api/cart/removeitem/${cartId}`, config)
      .then(() => {
        setCounter(counter - 1);
        setQuantityInStock(quantityInStock + 1);
        setUpdateCart(true);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setRequest(false);
        setError([error]);
      });

    setRequest(false);

    return controller.abort();
  };

  // Populate Product Qty
  useEffect(() => {
    setQuantityInStock(product.quantity_in_stock);
  }, [product]);

  // Check if the current user is selling this product
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const authToken = jwtDecode(localStorage.getItem("authToken"));
      setIsUserProduct(authToken.id === product.product_user);
    }
  }, [product.product_user]);

  return (
    <>
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isUserProduct ? (
          <Grid container direction="column" align="center">
            <Grid item>
              <Button
                variant="contained"
                onClick={() => navigate(`/products/${product._id}`)}
                sx={{ marginRight: 1 }}
              >
                View
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(`/account/products/edit/${product._id}`)
                }
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container direction="column" align="center">
              <Grid item>
                {counter <= 0 ? (
                  <Button
                    disabled={quantityInStock <= 0 || request}
                    variant="contained"
                    fullWidth
                    onClick={incrementQuantity}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <ButtonGroup>
                    <TextField
                      disabled
                      size="small"
                      value={counter}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">ea.</InputAdornment>
                        ),
                      }}
                      sx={{ width: "10ch", textAlign: "center" }}
                    >
                      {counter}
                    </TextField>
                    <Button
                      disabled={request}
                      variant="contained"
                      onClick={decrementQuantity}
                    >
                      -
                    </Button>
                    <Button
                      variant="contained"
                      disabled={quantityInStock <= 0 || request}
                      onClick={incrementQuantity}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                )}
              </Grid>
            </Grid>
          </>
        )}
        <Typography
          variant="body2"
          p={1}
          color={quantityInStock <= 0 ? "red" : "grey.800"}
        >
          {quantityInStock <= 0
            ? "Out of Stock"
            : `Stock Remaining: ${quantityInStock}`}
        </Typography>
      </Grid>
    </>
  );
};

export default AddToCartButton;
