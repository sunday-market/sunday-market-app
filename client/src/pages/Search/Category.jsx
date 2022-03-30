import { useEffect, useState } from "react";
import { useParams } from "react-router";

import axios from "axios";

import {
  Alert,
  Typography,
  Box,
  Grid,
  CircularProgress,
  CardMedia,
} from "@mui/material";

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
    <Box
      py={{ xs: 1, sm: 2, md: 4 }}
      px={{ xs: 2, sm: 4, md: 8, lg: 20 }}
      backgroundColor="white"
    >
      {error && (
        <Box p={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Typography variant="h4" align="center" color="grey.800" gutterBottom>
        <strong>{categoryName}</strong>
      </Typography>

      <CardMedia
        component="img"
        height="250px"
        image="https://exchange4media.gumlet.io/news-photo/95923-imagica.jpg?format=webp&w=750&dpr=1.0"
        src="Advertisment for eating vegetables"
        border="solid 1px #f0f0f0"
      />
      <Typography textAlign="center">Advertisment</Typography>

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
                    // sx={{ backgroundColor: "#01a9f4", color: "white" }}
                  >
                    <Typography
                      variant="h5"
                      mt={6}
                      align="left"
                      sx={{ fontWeight: "bold" }}
                    >
                      {category.subcategory}
                    </Typography>
                  </Grid>
                  {category.products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} p={1} key={product._id}>
                      <ProductCard
                        product={{
                          ...product,
                          subcategory: category.subcategory,
                        }}
                      />
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
