import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Box, Grid, Container, Typography } from "@mui/material";
import ProductCard from "../../components/Products/ProductCard";
import AddProductCard from "../../components/Products/AddProductCard";

import jwtDecode from "jwt-decode";
import axios from "axios";

import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const { setLoading, setError } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    (async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
      };

      const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
      await axios
        .get(`/api/product/user/${decodedJWT.id}`, config)
        .then((result) => {
          setProducts(result.data);
        })
        .catch((error) => {
          setError([error]);
          setLoading(false);
          scrollToTop();
          controller.abort();
        });
    })();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [navigate, setError, setLoading]);

  return (
    <>
      <Box
        component="main"
        p={2}
        py={{ xs: 2, md: 3, lg: 4 }}
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="h4" gutterBottom>
            My Products
          </Typography>

          <Box sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              {/* Add Product Card  */}
              <Grid
                item
                lg={3}
                md={4}
                sm={6}
                xs={12}
                onClick={() => navigate("../add")}
              >
                <AddProductCard />
              </Grid>

              {products.map((product) => (
                <Grid item key={product._id} lg={3} md={4} sm={6} xs={12}>
                  <ProductCard
                    product={product}
                    qty={product.quantity_in_stock}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MyProducts;
