import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Grid,
  Container,
  Pagination,
  Typography,
  Alert,
} from "@mui/material";
import ProductCard from "../../components/Products/ProductCard";
import AddProductCard from "../../components/Products/AddProductCard";

import jwtDecode from "jwt-decode";
import axios from "axios";
const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
        const data = await axios.get(`/api/product/user/${decodedJWT.id}`);

        setProducts(data.data);
      } catch (error) {
        setError(error.response.data.error);

        setTimeout(() => {
          setError("");
        }, 5000);
      }
    })();
  }, []);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="h4" gutterBottom>
            My Products
          </Typography>

          {error && (
            <Box sx={{ marginY: "1em" }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <Pagination color="primary" count={3} size="small" />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MyProducts;
