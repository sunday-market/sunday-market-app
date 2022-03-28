import { useEffect, useState } from "react";
import { useParams } from "react-router";

import axios from "axios";

import { Alert, Typography, Box, Grid, CircularProgress } from "@mui/material";

import ProductCard from "../../components/Products/ProductCard";

const Category = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { categoryId } = useParams();

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();

    (async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      };

      await axios
        .get(`/api/category/get/${categoryId}`, config)
        .then((result) => {
          if (!unmounted) {
            setCategoryName(result.data);
            controller.abort();
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return "axios request cancelled...";
          }

          if (!unmounted) {
            setError(error.response.data.error);
            setTimeout(() => {
              setError("");
            }, 5000);
          }
        });
    })();

    return () => {
      unmounted = true;
      controller.abort();
    };
  }, [categoryId]);

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();

    (async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      };

      await axios
        .get(`/api/product/category/${categoryId}`, config)
        .then((result) => {
          if (!unmounted) {
            setSubcategories(result.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return "axios request cancelled...";
          }

          if (!unmounted) {
            setError(error.response.data.error);
            setTimeout(() => {
              setError("");
            }, 5000);
          }
        });
    })();

    return () => {
      unmounted = true;
      controller.abort();
    };
  }, [categoryId]);

  return (
    <Box p={{ xs: 1, sm: 2, md: 4 }} backgroundColor="white">
      {error && (
        <Box p={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Typography variant="h4" align="center" color="grey.800" gutterBottom>
        <strong>{categoryName}</strong>
      </Typography>

      {loading ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          {subcategories.map((category) => (
            <Box component="span" key={category._id}>
              {category.products.length > 0 && (
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    p={1}
                    mt={1}
                    sx={{ backgroundColor: "#01a9f4", color: "white" }}
                  >
                    <Typography variant="h5" align="center">
                      {category.subcategory}
                    </Typography>
                  </Grid>
                  {category.products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} p={1} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default Category;
