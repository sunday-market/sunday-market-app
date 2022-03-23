import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Divider,
  Button,
} from "@mui/material";

import IncDecButton from "../IncDecButton";

const ProductCard = (props) => {
  const { product, qty } = props;
  const [isUserProduct, setIsUserProduct] = useState(false);
  const [counter, setCounter] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(qty);

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const incrementQuantity = () => {
    setCounter(counter + 1);
    setQuantityInStock(quantityInStock - 1);
  };

  const decrementQuantity = () => {
    setCounter(counter - 1);
    setQuantityInStock(quantityInStock + 1);
  };

  const priceToCurrency = (price) => {
    return Number(price).toLocaleString("en-NZ", {
      style: "currency",
      currency: "NZD",
    });
  };

  // Check if the current user is selling this product
  useEffect(() => {
    (async () => {
      const authToken = await jwtDecode(localStorage.getItem("authToken"));
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
              image={`${PUBLIC_FOLDER}/products/${product.image}`}
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
              <Button>View</Button>
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
                <Box sx={{marginBottom: 2}}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/products/${product._id}`)}
                    sx={{ marginRight: 1 }}
                  >
                    View Product
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/account/products/${product._id}`)}
                  >
                    Edit
                  </Button>
                </Box>
              ) : (
                <IncDecButton
                  counter={counter}
                  quantityInStock={quantityInStock}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                />
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
