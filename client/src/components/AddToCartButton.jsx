import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";
import axios from "axios";

import {
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
  ButtonGroup,
} from "@mui/material";

const AddToCartButton = ({ product }) => {
  const [request, setRequest] = useState(false);
  const [isUserProduct, setIsUserProduct] = useState(false);
  const [counter, setCounter] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(0);

  const navigate = useNavigate();

  const incrementQuantity = async () => {
    setRequest(true);

    const controller = new AbortController();
    const cartId = localStorage.getItem("shoppingCartId");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };

    await axios
      .post(`/api/cart/additem/${cartId}`, product, config)
      .then(() => {
        setCounter(counter + 1);
        setQuantityInStock(quantityInStock - 1);
        controller.abort();
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return "axios request cancelled...";
        }
      });

    setRequest(false);
    return () => {
      controller.abort();
    };
  };

  const decrementQuantity = async () => {
    setRequest(true);
    const controller = new AbortController();

    const cartId = localStorage.getItem("shoppingCartId");
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

    await axios
      .delete(`/api/cart/removeitem/${cartId}`, config)
      .then(() => {
        setCounter(counter - 1);
        setQuantityInStock(quantityInStock + 1);
        controller.abort();
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return "axios request cancelled...";
        }
      });

    setRequest(false);

    return () => {
      controller.abort();
    };
  };

  // Populate Product Qty
  useEffect(() => {
    setQuantityInStock(product.quantity_in_stock);
  }, [product]);

  // Check if the current user is selling this product
  useEffect(() => {
    (async () => {
      const authToken = jwtDecode(localStorage.getItem("authToken"));
      setIsUserProduct(authToken.id === product.product_user);
    })();
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
          <Box sx={{ marginBottom: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/products/${product._id}`)}
              sx={{ marginRight: 1 }}
            >
              View
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/account/products/edit/${product._id}`)}
            >
              Edit
            </Button>
          </Box>
        ) : (
          <>
            <Grid container direction="column" align="center" p={1}>
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
                      sx={{ width: "12ch", textAlign: "center" }}
                    >
                      {counter}
                    </TextField>
                    <Button
                      disabled={request}
                      variant="contained"
                      margin={1}
                      onClick={decrementQuantity}
                    >
                      -
                    </Button>
                    <Button
                      variant="contained"
                      disabled={quantityInStock <= 0 || request}
                      margin={1}
                      onClick={incrementQuantity}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                )}
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              color={quantityInStock <= 0 ? "red" : "grey.800"}
            >
              {quantityInStock <= 0
                ? "Out of Stock"
                : `Stock Remaining: ${quantityInStock}`}
            </Typography>
          </>
        )}
      </Grid>
    </>
  );
};

export default AddToCartButton;
