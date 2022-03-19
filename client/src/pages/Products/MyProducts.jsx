import React from "react";
import { Box, Grid, Container, Pagination } from "@mui/material";
import ProductCard from "../../components/Products/ProductCard";
import AddProductCard from "../../components/Products/AddProductCard";

const products = [
  {
    id: 1,
    name: "Strawberries 500g Punnet",
    image:
      "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain",
    category: "Fruits and Vegetables",
    qty: 3,
    price: "2.99",
  },
  {
    id: 2,
    name: "Royal Gala Apples 1kg",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXBwbGVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain",
    category: "Fruits and Vegetables",
    qty: 5,
    price: "1.50",
  },
  {
    id: 3,
    name: "Dirt Bike",
    image:
      "https://images.unsplash.com/photo-1542550546-88afdd84b64f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlydCUyMGJpa2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain",
    category: "Motor Vehicles",
    qty: 1,
    price: "10299",
  },
  {
    id: 4,
    name: "Kite",
    image:
      "https://images.unsplash.com/flagged/photo-1583603275310-33d386c7298a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2l0ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain, This is a test product.  This is dummy data to see what the contents of the title will contain This is a test product.  This is dummy data to see what the contents of the title will contain, This is a test product.  This is dummy data to see what the contents of the title will contain",
    category: "Kids",
    qty: 3,
    price: "15",
  },
  {
    id: 5,
    name: "Couch",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y291Y2h8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    description:
      "This is a test product.  This is dummy data to see what the contents of the title will contain",
    category: "Furniture",
    qty: 1,
    price: "500",
  },
];
const MyProducts = () => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <AddProductCard />
              </Grid>

              {products.map((product) => (
                <Grid item key={product.id} lg={3} md={4} sm={6} xs={12}>
                  <ProductCard
                    key={product.id}
                    product={product}
                    qty={product.qty}
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
