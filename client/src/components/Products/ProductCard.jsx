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

import { priceToCurrency } from "../../utils/currency";
import AddToCartButton from "../../components/AddToCartButton";

const ProductCard = ({ product }) => {
  const [isUserProduct, setIsUserProduct] = useState(false);

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

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

            <Typography
              gutterBottom
              align="center"
              variant="body2"
              sx={{ backgroundColor: "#eeeeee" }}
            >
              {product.subcategory || ""}
            </Typography>

            <Typography variant="body1" align="center">
              <b>{product.product_name}</b>
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
              <AddToCartButton product={product} />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default ProductCard;
