import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Grid
} from "@mui/material";

import IncDecButton from "./IncDecButton";

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

  return (
    <>
      <Card product={product} sx={{ maxWidth: 300, border: "solid 1px #c3c3c3"}} >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>

            <CardMedia
              component="img"
              height="200"
              image={product.image}
              alt={product.name}
            />
            <Typography variant="body1" color="text.secondary">
              <strong>{product.category}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" alignItems="center">
              {product.description}
            </Typography>
          </CardContent>
        </CardActionArea>

        <Grid container>
          <Grid item>
            {counter}
          </Grid>
          <Grid item>
            {product.price}
          </Grid>
        </Grid>


        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <IncDecButton
            counter={counter}
            quantityInStock={quantityInStock}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
          <Typography variant="body2" align="center" mb={2} color="text.secondary">
            Quantity Remaining: {quantityInStock}
          </Typography>
        </Card>
      </Card>
    </>
  );
};

export default ProductCard;
