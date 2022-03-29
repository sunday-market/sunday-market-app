import { Box, Typography, Container, Grid } from "@mui/material";
import Carousel from "../../components/Carousel";
import CategoryAvatars from "../../components/CategoryAvatars";
import { useIsMobileScreen } from "../../hooks/useIsMobileScreen";
import ProductCard from "../../components/Products/ProductCard";

export default function LandingPage() {
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

  // this will adjust the screen size accordinly
  const windowSize = useIsMobileScreen();

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          margin: 0,
          padding: "1% 2%",
          maxwidth: "100%",
          maxHeight: "100%",
          bgcolor: "#f5f5f5",
        }}
      >
        {/* {windowSize && <Carousel Cards={CardArray} />} */}
        <Typography
          sx={{
            margin: "auto",
            marginBottom: 0,
            pt: 3,
            pl: "9%",
            pb: 0,
            textAlign: "left",
            fontSize: 36,
            fontWeight: "bold",
          }}
        >
          Recently Added
        </Typography>
        {/* Item Cards of recently added */}

        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Container maxWidth={false}>
            <Box sx={{ pt: 0 }}>
              <Grid container spacing={3} sx={{ p: 2 }}>
                {Array.from(Array(6)).map((_, index) => (
                  <Grid item key={index} lg={3} md={4} sm={6} xs={12}>
                    <ProductCard
                      key={index}
                      product={product}
                      qty={product.qty}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Box>
        {windowSize && (
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <Container maxWidth={false}>
              <Box sx={{ pt: 0 }}>
                <Grid container spacing={3} sx={{ p: 2 }}>
                  {Array.from(Array(12)).map((_, index) => (
                    <Grid item lg={2} md={3} sm={4}>
                      <CategoryAvatars />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Container>
          </Box>
        )}
        {/* Category Avatars */}
      </Box>
    </>
  );
}
