import {
  Box,
  Grid,
  Button,
  Card,
  Typography,
  CardContent,
  CardMedia,
} from "@mui/material";

export default function ItemCard({
  cardTitle,
  imgTitle,
  imgSource,
  stallActive,
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
            <Typography
              gutterBottom
              variant="body1"
              align="center"
              sx={{
                fontWeight: "bold",
              }}
            >
              {cardTitle ? cardTitle.toUpperCase() : "Card Title"}
            </Typography>
            {/* Backup Image taken from below link */}
            {/* https://unsplash.com/photos/WtolM5hsj14 */}
            <CardMedia
              component="img"
              height="175"
              alt={
                imgTitle
                  ? imgTitle
                  : "No alternative text has been provided for this image, we are very sorry for your inconvience"
              }
              image={
                imgSource
                  ? imgSource
                  : "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
              }
            ></CardMedia>
            {stallActive ? (
              <Typography
                gutterBottom
                align="center"
                variant="body2"
                sx={{
                  mt: 1,
                  marginBottom: 0,
                  color: "green",
                  backgroundColor: "#eeeeee",
                }}
              >
                STALL ACTIVATED
              </Typography>
            ) : (
              <Typography
                gutterBottom
                align="center"
                variant="body2"
                sx={{
                  mt: 1,
                  marginBottom: 0,
                  color: "red",
                  backgroundColor: "#eeeeee",
                }}
              >
                STALL DEACTIVATED
              </Typography>
            )}
            <Typography
              gutterBottom
              align="center"
              variant="body2"
              sx={{ backgroundColor: "#eeeeee" }}
            >
              {cardCategory}
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
            {cardDescription}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ pb: 2, pt: 2 }}>
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
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  pl: 1,
                  pr: 1,
                  pt: 0.5,
                  pb: 0.5,
                  margin: 0.5,
                  borderRadius: 25,
                  fontFamily: "Tahoma",
                }}
                onClick={CardDetails}
              >
                View Details
              </Button>
              <Button
                variant="contained"
                sx={{
                  pl: 1,
                  pr: 1,
                  pt: 0.5,
                  pb: 0.5,
                  margin: 0.5,
                  borderRadius: 25,
                  fontFamily: "Tahoma",
                }}
                onClick={AddToCart}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}
