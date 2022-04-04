import { useEffect, useState, useContext } from "react";
import axios from "axios";

//import Carousel from "../../components/Carousel";
import CategoryAvatars from "../../components/CategoryAvatars";

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  CardMedia,
} from "@mui/material";

import ProductCard from "../../components/Products/ProductCard";
import { useIsMobileScreen } from "../../hooks/useIsMobileScreen";
import DataContext from "../../context/DataContext";

const LandingPage = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { setError, loading, setLoading, categories } = useContext(DataContext);

  const isMobileScreen = useIsMobileScreen();

  // Get Recently Added Products
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      };

      await axios
        .get("/api/product/recent", config)
        .then((result) => {
          setRecentProducts(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
        });
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [setLoading, setError]);
  console.log(categories);
  return (
    <Box px={{ xs: 2, sm: 4, md: 8, lg: 20 }} py={2}>
      {loading ? (
        <>
          <Box
            display="flex"
            direction="row"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100%"
          >
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          {/* Carousel */}
          <Grid container>{/* <Carousel Cards={CardArray} /> */}</Grid>

          <CardMedia
            component="img"
            height="250px"
            image="https://media-assets-05.thedrum.com/cache/images/thedrum-prod/s3-news-tmp-77017-image-placeholder-title--default--1200.jpg"
            src="Advertisment for eating vegetables"
            border="solid 1px #f0f0f0"
          />
          <Typography textAlign="center">Advertisment</Typography>

          {/* Recently Added Products */}
          <Grid container mt={4}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                px={2}
                sx={{
                  fontWeight: "bold",
                }}
              >
                Recently Added
              </Typography>
            </Grid>
            {recentProducts.map((product) => (
              <Grid
                item
                key={product._id}
                xs={12}
                sm={4}
                md={3}
                p={{ xs: 2, sm: 1, md: 2 }}
              >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          {/* Product Categories  */}
          {!isMobileScreen && (
            <Grid container mt={4} spacing={0}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  px={2}
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Product Categories
                </Typography>
              </Grid>
              {categories?.map((category, index) => (
                <Grid
                  container
                  item
                  sm={4}
                  md={3}
                  p={1}
                  key={index}
                  justifyContent="center"
                  alignContent={"center"}
                >
                  <CategoryAvatars
                    categoryTitle={category.category_name}
                    categoryLink={`/search/category/${category._id}`}
                    categoryId={category._id}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default LandingPage;
