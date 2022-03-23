import { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Divider,
  Button,
} from "@mui/material";

import IncDecButton from "../IncDecButton";

const ProductCard = (props) => {
  const { product, qty } = props;
  const [counter, setCounter] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(qty);

  const incrementQuantity = () => {
    setCounter(counter + 1);
    setQuantityInStock(quantityInStock - 1);
  };

  const decrementQuantity = () => {
    setCounter(counter - 1);
    setQuantityInStock(quantityInStock + 1);
  };

  const priceToCurrency = (price) => {
    return Number(price).toLocaleString("en-NZ", {
      style: "currency",
      currency: "NZD",
    });
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "solid 1px #eeeeee",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pb: 1,
            }}
          >
            <CardMedia
              component="img"
              height="175"
              image={product.image}
              alt={product.product_name}
            />

            <Typography gutterBottom variant="body1" align="center">
              <b>{product.product_name}</b>
            </Typography>
            <Typography
              gutterBottom
              align="center"
              variant="body2"
              sx={{ backgroundColor: "#eeeeee" }}
            >
              {product.product_subcategory}
            </Typography>
          </Box>

          <Typography
            align="center"
            color="textPrimary"
            variant="body2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box !important",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.product_description}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider margin={1} />
        <Box sx={{ p: 2 }}>
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Grid
              item
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                color="grey.800"
                sx={{ pl: 1, fontFamily: "Tahoma" }}
                variant="h5"
              >
                {priceToCurrency(product.product_price)}
              </Typography>
              <Button>View</Button>
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IncDecButton
                counter={counter}
                quantityInStock={quantityInStock}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
              />
              <Typography
                variant="body2"
                color={quantityInStock <= 0 ? "red" : "grey.800"}
              >
                {quantityInStock <= 0
                  ? "Out of Stock"
                  : `Stock Remaining: ${quantityInStock}`}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default ProductCard;
