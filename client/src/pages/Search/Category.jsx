import { useEffect, useState, useContext } from "react";
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
import { scrollToTop } from "../../utils/ux";
import DataContext from "../../context/DataContext";

const Category = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const { setError, setLoading } = useContext(DataContext);
  const { categoryId } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

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
          setCategoryName(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
          scrollToTop();
        });
    })();

    return () => {
      controller.abort();
    };
  }, [categoryId, setError, setLoading]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

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
          setSubcategories(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
          scrollToTop();
        });
    })();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [categoryId, setError, setLoading]);

  return (
    <Box
      py={{ xs: 1, sm: 2, md: 4 }}
      px={{ xs: 2, sm: 4, md: 8, lg: 20 }}
      backgroundColor="white"
    >
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

      {subcategories.map((category) => (
        <Box component="span" key={category._id}>
          {category.products.length > 0 && (
            <Grid container>
              <Grid item xs={12} p={1} mt={1}>
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
    </Box>
  );
};

export default Category;
