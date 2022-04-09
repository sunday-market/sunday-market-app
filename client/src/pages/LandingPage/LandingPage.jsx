import { useEffect, useState, useContext } from "react";
import axios from "axios";

import "react-alice-carousel/lib/alice-carousel.css";
import CategoryAvatars from "../../components/CategoryAvatars";

import { Box, Typography, Grid, CardMedia } from "@mui/material";

import ProductCard from "../../components/Products/ProductCard";
import { useIsMobileScreen } from "../../hooks/useIsMobileScreen";
import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";
import Carousel from "../../components/Carousel/Carousel";

const LandingPage = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const { setError, setLoading, categories } = useContext(DataContext);
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
          scrollToTop();
        });
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [setLoading, setError]);

  const genterateRandomIndex = (numberOfProducts) => {
    const randomInt = Math.floor(Math.random() * numberOfProducts);
    return randomInt;
  };

  // need to add if check for when mobile screen as don't want to load products when mobile
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    };
    // only run if random products is a length of 0
    if (randomProducts.length === 0) {
      // if goes here
      const getAllProducts = async () => {
        try {
          const products = await (
            await axios.get("/api/product/", config)
          ).data;
          console.log(products);
          const numberOfRandomProducts = 5;
          for (let i = 0; i < numberOfRandomProducts; i++) {
            let randomIndex = genterateRandomIndex(products.length);
            setRandomProducts((prev) => [...prev, products[randomIndex]]);
            products.splice(randomIndex, 1);
          }
        } catch (error) {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
          scrollToTop();
        }
      };
      getAllProducts();
    }
  }, [randomProducts.length, setError, setLoading]);

  return (
    <Box px={{ xs: 2, sm: 4, md: 8, lg: 20 }} py={2}>
      <CardMedia
        component="img"
        height="250px"
        image="https://media-assets-05.thedrum.com/cache/images/thedrum-prod/s3-news-tmp-77017-image-placeholder-title--default--1200.jpg"
        src="Advertisment for eating vegetables"
        border="solid 1px #f0f0f0"
      />
      <Typography textAlign="center">Advertisment</Typography>

      {/* Carousel */}
      <Carousel />

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
              sm={3}
              md={2}
              p={1}
              key={index}
              justifyContent="center"
              alignContent={"center"}
              spacing={0}
            >
              <Grid item margin={1} sx={{ aspectRatio: "1 / 1" }}>
                <CategoryAvatars
                  categoryTitle={category.category_name}
                  categoryLink={`/search/category/${category._id}`}
                  category_id={category._id}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LandingPage;
