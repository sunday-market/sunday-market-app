import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import { Alert, Button, Typography, Divider, CardMedia } from "@mui/material";
import { Box, Grid } from "@mui/material";
import IncDecButton from "../../components/IncDecButton";

import { priceToCurrency } from "../../utils/currency";

const ViewProduct = () => {
  const [product, setProduct] = useState([]);
  const [stall, setStall] = useState([]);
  const [error, setError] = useState("");

  const [counter, setCounter] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(0);

  const navigate = useNavigate();
  const { productId } = useParams();

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        // Get Product Information
        const productData = await axios.get(
          `/api/product/${productId}`,
          config
        );
        setProduct(productData.data);

        setQuantityInStock(productData.data.quantity_in_stock);

        // Get Stall Information
        const stallData = await axios.get(
          `/api/stalls/${productData.data.product_stall}`
        );
        setStall(stallData.data[0]);
      } catch (error) {
        setError(error.response.data.error);

        setTimeout(() => {
          setError("");
        }, 5000);
      }
    })();
  }, [navigate, productId]);

  const incrementQuantity = () => {
    setCounter(counter + 1);
    setQuantityInStock(quantityInStock - 1);
  };

  const decrementQuantity = () => {
    setCounter(counter - 1);
    setQuantityInStock(quantityInStock + 1);
  };

  return (
    <Box p={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="h4" textAlign="center" gutterBottom>
        {product.product_name}
      </Typography>

      <Grid container spacing={0} justifyContent="center">
        {/* Product Image  */}
        <Grid item xs={12} sm={5} md={4}>
          <Box
            component="img"
            width="100%"
            src={
              product.image
                ? `${PUBLIC_FOLDER}products/${product.image}`
                : `${PUBLIC_FOLDER}products/noimage.jpg`
            }
            alt={product.product_name}
          />
        </Grid>

        {/* Product Description / Information  */}
        <Grid item xs={12} sm={7} md={5} p={2}>
          <Typography variant="body1">
            <strong>{product.product_name}</strong>
          </Typography>
          <Typography variant="body2">{product.product_subcategory}</Typography>

          <Divider />

          <Typography variant="body1" pt={2}>
            {product.product_description}
          </Typography>
        </Grid>

        {/* Stall Information & Add to Cart  */}
        <Grid item xs={12} sm={10} md={3} mt={{ xs: 3, md: 0 }}>
          <Box
            p={1}
            border={{ xs: "none", md: "solid 1px #e0e0e0" }}
            borderRadius={2}
          >
            <Box
              display="flex"
              height="100%"
              flexGrow={1}
              flexDirection="column"
            >
              <Box
                flexGrow={1}
                backgroundColor="#f0f0f0"
                borderRadius={2}
                p={1}
                justifyContent="center"
                order={{ xs: 2, md: 1 }}
              >
                <Typography variant="h6" align="center" pt={1}>
                  <strong>Stall Details</strong>
                </Typography>

                <CardMedia
                  component="img"
                  height="175"
                  image={
                    stall.image
                      ? `${PUBLIC_FOLDER}stalls/${stall.image}`
                      : `${PUBLIC_FOLDER}stalls/noimage.png`
                  }
                  alt={stall.stallName}
                />

                <Typography variant="body1" align="center" pt={1}>
                  <strong>{stall.stallName}</strong>
                </Typography>
                <Typography variant="body2" align="center" pb={2}>
                  {stall.city_location}
                </Typography>

                <Box display="flex" justifyContent="center" p={2}>
                  <Button variant="contained" sx={{ marginRight: 1 }}>
                    View
                  </Button>
                  <Button variant="outlined">Contact</Button>
                </Box>
              </Box>

              <Box
                mt={{ xs: 1, md: 3 }}
                mb={{ xs: 4, md: 0 }}
                order={{ xs: 1, md: 2 }}
                border={{ xs: "solid 1px #e0e0e0", md: "none" }}
                borderRadius={{ xs: 5, md: 0 }}
                p={{ xs: 3, md: 0 }}
              >
                <Typography variant="h4" textAlign="center">
                  {priceToCurrency(product.product_price)}
                </Typography>
                <IncDecButton
                  counter={counter}
                  quantityInStock={quantityInStock}
                  incrementQuantity={incrementQuantity}
                  decrementQuantity={decrementQuantity}
                />
                <Typography align="center">
                  Remaining Stock: {quantityInStock}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewProduct;
