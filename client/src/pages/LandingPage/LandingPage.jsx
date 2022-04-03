import { useEffect, useState } from "react";
import axios from "axios";

import Carousel from "../../components/Carousel";
import CategoryAvatars from "../../components/CategoryAvatars";

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  CardMedia,
} from "@mui/material";

import ProductCard from "../../components/Products/ProductCard";
import { useIsMobileScreen } from "../../hooks/useIsMobileScreen";

const LandingPage = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const CardArray = [
    {
      textId: "Card 1",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.",
    },
    {
      textId: "Card 2",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.",
    },
    {
      textId: "Card 3",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.",
    },
    {
      textId: "Card 4",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.",
    },
    {
      textId: "Card 5",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum dicta et hic dignissimos? Accusamus consectetur ducimus quae voluptates nam officia omnis aut sint. Tenetur culpa incidunt quam. Dicta, veritatis ad.",
    },
  ];
  const product = {
    id: 1,
    product_name: "Strawberries 500g Punnet",
    product_image:
      "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    product_description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain",
    product_category: "Fruits and Vegetables",
    qty: 3,
    product_price: "2.99",
  };

  // this will adjust the screen size accordingly
  // const windowSize = useIsMobileScreen();

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
          if (axios.isCancel(error)) {
            return "Request Cancelled...";
          }
          setError(error.message);
        });
    })();
    setLoading(false);

    return () => {
      controller.abort();
    };
  }, []);

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
          {error && <Alert severity="error">{error}</Alert>}

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
          <Grid container mt={4} display={{ xs: "none", sm: "flex" }}>
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

            {Array.from(Array(12)).map((_, index) => (
              <Grid item sm={4} md={3} lg={2} p={3} key={index}>
                <CategoryAvatars />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default LandingPage;
