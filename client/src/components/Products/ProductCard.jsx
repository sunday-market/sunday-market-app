import { useNavigate } from "react-router";
import { Typography, Grid, Card, CardMedia, Box, Divider } from "@mui/material";
import { scrollToTop } from "../../utils/ux";
import { priceToCurrency } from "../../utils/currency";
import AddToCartButton from "../../components/AddToCartButton";

const ProductCard = ({ product }) => {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const handleNavigate = () => {
    scrollToTop();
    return navigate(`/products/${product._id}`);
  };
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          // boxShadow: "0px 0px 5px 0px rgba(64,64,64,0.35);",
          border: "solid 1px #c3c3c3",
        }}
      >
        <Box position="relative">
          <CardMedia
            onClick={handleNavigate}
            component="img"
            height="175"
            image={
              product.image
                ? `${PUBLIC_FOLDER}products/${product.image}`
                : `${PUBLIC_FOLDER}products/noimage.jpg`
            }
            alt={product.product_name}
            sx={{
              boxShadow: "0px 5px 20px 2px rgba(64,64,64,0.35);",
              cursor: "pointer",
              // border: "solid 1px grey"
            }}
          />
          <Typography
            position="absolute"
            bottom="0"
            m={1}
            align="center"
            variant="body2"
            width="inherit"
            color="white"
            fontStyle="italic"
            backgroundColor="#39B8FF"
            border="solid 1px white"
            borderRadius={2}
            px={1}
          >
            {product.subcategory || ""}
          </Typography>
        </Box>

        <Typography mt={2} variant="body1" align="center" gutterBottom>
          <b>{product.product_name}</b>
        </Typography>

        <Typography
          align="center"
          color="grey.500"
          variant="body2"
          gutterBottom
          onClick={handleNavigate}
          pb={3}
          px={1}
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box !important",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            cursor: "pointer",
          }}
        >
          {product.product_description || "No description"}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        <Divider margin={1} />

        <Grid container direction="column" sx={{ justifyContent: "center" }}>
          <Grid
            item
            p={2}
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              color="blue.800"
              sx={{ fontFamily: "Tahoma", fontWeight: "bold" }}
              variant="h5"
              align="center"
            >
              {priceToCurrency(product.product_price)}
            </Typography>
            {/* {!isUserProduct && (
              <Button onClick={() => navigate(`/products/${product._id}`)}>
                View
              </Button>
            )} */}
          </Grid>

          <Grid
            item
            width="100%"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AddToCartButton product={product} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ProductCard;
