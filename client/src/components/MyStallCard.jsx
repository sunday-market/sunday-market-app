import { Box, Button, Card, Typography } from "@mui/material";

export default function ItemCard({
  cardTitle,
  imgTitle,
  imgSource,
  cardCategory,
  cardDescription,
}) {
  const AddToCart = async (e) => {
    console.log("Add to cart");
  };
  const CardDetails = async (e) => {
    console.log("Details clicked");
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth:300,
          height: 450,
          maxHeight: 600,
          margin: "auto",
          borderRadius: 5,
          bgcolor: "#eceff1",
          boxShadow: 3,
        }}
      >
        <Typography
          sx={{
            p: 2,
            fontWeight: "bold",
          }}
        >
          {cardTitle ? cardTitle : "Card Title"}
        </Typography>
        {/* Image taken from below link */}
        {/* https://unsplash.com/photos/WtolM5hsj14 */}
        <Box
          component="img"
          sx={{
            bgcolor: "#eceff1",
            height: "100%",
            minWidth: "80%",
            maxHeight: "35%",
            maxWidth: "85%",
            borderRadius: 10,
          }}
          alt={
            imgTitle
              ? imgTitle
              : "No alternative text has been provided for this image, we are very sorry for your inconvience"
          }
          src={
            imgSource
              ? imgSource
              : "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
          }
        />
        <Typography sx={{ p: 2, pb: 0, marginBottom: 0 }}>
          {cardCategory ? cardCategory : "Card Category"}
        </Typography>
        <Typography
          sx={{
            p: 2,
            pl: 3,
            pr: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            "-webkit-line-clamp": "3",
            "-webkit-box-orient": "vertical",
          }}
        >
          {cardDescription
            ? cardDescription
            : "No Description has been giving to this product or stall card. blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"}
        </Typography>
        <Box sx={{ marginTop: "5%", width: "100%", pb: 0, display: "block" }}>
          <Button
            variant="outlined"
            sx={{ margin: 2, borderRadius: 25 }}
            onClick={CardDetails}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            sx={{ margin: 2, borderRadius: 25 }}
            onClick={AddToCart}
          >
            Update
          </Button>
        </Box>
      </Card>
    </>
  );
}
