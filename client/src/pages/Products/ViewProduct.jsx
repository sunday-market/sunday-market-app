import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import { Button, Typography, Divider, CardMedia } from "@mui/material";
import { Box, Grid } from "@mui/material";
import AddToCartButton from "../../components/AddToCartButton";
import SendMessageButton from "../../components/SendMessageButton";

import { priceToCurrency } from "../../utils/currency";
import DataContext from "../../context/DataContext";

import { scrollToTop } from "../../utils/ux";

const ViewProduct = () => {
  const [product, setProduct] = useState([]);
  const [stall, setStall] = useState([]);

  const { setError, setLoading, loggedInUser } = useContext(DataContext);

  const navigate = useNavigate();
  const { productId } = useParams();

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        };

        // Get Product Information
        const productData = await axios.get(
          `/api/product/${productId}`,
          config
        );
        setProduct(productData.data[0]);

        // Get Stall Information
        const stallData = await axios.get(
          `/api/stalls/${productData.data[0].product_stall}`
        );

        setStall(stallData.data[0]);
      } catch (error) {
        setLoading(false);
        if (axios.isCancel(error)) return;
        setError([error]);
        scrollToTop();
      }
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [navigate, productId, setError, setLoading]);

  return (
    <Box p={2}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {product.product_name}
      </Typography>

      <Grid container spacing={0} justifyContent="center">
        {/* Product Image  */}
        <Grid item xs={12} sm={5} md={4} p={2}>
          <Box
            component="img"
            width="100%"
            src={
              product.image
                ? `${PUBLIC_FOLDER}products/${product.image}`
                : `${PUBLIC_FOLDER}products/noimage.jpg`
            }
            alt={product.product_name}
            borderRadius={1}
            sx={{
              boxShadow: "1px 1px 10px 1px rgba(64,64,64,0.75);",
            }}
          />
        </Grid>

        {/* Product Description / Information  */}
        <Grid item xs={12} sm={7} md={5} p={2}>
          <Typography variant="body1">
            <strong>{product.product_name}</strong>
          </Typography>
          <Typography variant="body2">{product.subcategory}</Typography>

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

                {loggedInUser?._id?.toString() !==
                  product?.product_user?.toString() && (
                  <Box display="flex" justifyContent="center" p={2}>
                    <Button
                      variant="contained"
                      sx={{ marginRight: 1 }}
                      onClick={() =>
                        navigate(
                          `/account/stalls/viewstall/${product.product_stall}`
                        )
                      }
                    >
                      View
                    </Button>
                    <SendMessageButton stall={stall} />
                  </Box>
                )}
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

                <AddToCartButton product={product} />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewProduct;
