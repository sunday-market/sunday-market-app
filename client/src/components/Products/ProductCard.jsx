import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";
import axios from "axios";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Divider,
  Button,
  TextField,
  InputAdornment,
  ButtonGroup,
} from "@mui/material";

import { priceToCurrency } from "../../utils/currency";

const ProductCard = ({ product }) => {
  const [request, setRequest] = useState(false);
  const [isUserProduct, setIsUserProduct] = useState(false);
  const [counter, setCounter] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(0);

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
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
        _id: product._id
      }
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
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "solid 1px #eeeeee",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pb: 1,
            }}
          >
            <CardMedia
              component="img"
              height="175"
              image={
                product.image
                  ? `${PUBLIC_FOLDER}products/${product.image}`
                  : `${PUBLIC_FOLDER}products/noimage.jpg`
              }
              alt={product.product_name}
            />

            <Typography gutterBottom variant="body1" align="center">
              <b>{product.product_name}</b>
            </Typography>
            <Typography
              gutterBottom
              align="center"
              variant="body2"
              sx={{ backgroundColor: "#eeeeee" }}
            >
              {product.product_subcategory}
            </Typography>
          </Box>

          <Typography
            align="center"
            color="textPrimary"
            variant="body2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box !important",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.product_description}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider margin={1} />
        <Box sx={{ p: 2 }}>
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Grid
              item
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                color="grey.800"
                sx={{ pl: 1, fontFamily: "Tahoma" }}
                variant="h5"
              >
                {priceToCurrency(product.product_price)}
              </Typography>
              {!isUserProduct && (
                <Button onClick={() => navigate(`/products/${product._id}`)}>
                  View
                </Button>
              )}
            </Grid>

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
                    onClick={() =>
                      navigate(`/account/products/edit/${product._id}`)
                    }
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
                                <InputAdornment position="end">
                                  ea.
                                </InputAdornment>
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

                    <Grid item></Grid>
                  </Grid>
                </>
              )}

              <Typography
                variant="body2"
                color={quantityInStock <= 0 ? "red" : "grey.800"}
              >
                {quantityInStock <= 0
                  ? "Out of Stock"
                  : `Stock Remaining: ${quantityInStock}`}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default ProductCard;
