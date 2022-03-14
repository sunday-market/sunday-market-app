import { Box, Typography } from "@mui/material";
import "./landingPage.css";
import Carousel from "../../components/Carousel";
import ItemCard from "../../components/ItemCard";
import Grid from "@mui/material/Grid";

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

export default function LandingPage() {
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
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 1, md: 1 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item sx={{ bgcolor: "grey", width: "100%", margin: "auto" }}>
              <Carousel Cards={CardArray} />
            </Grid>
            <Typography
              sx={{
                width: "100%",
                margin: "auto",
                marginBottom: 0,
                p: 3,
                pl: 15,
                pb: 0,
                textAlign: "left",
                fontSize: 36,
                fontWeight: "bold",
              }}
            >
              Recently Added
            </Typography>
            {Array.from(Array(4)).map((_, index) => (
              <Grid
                item
                xs={12}
                md={3}
                key={index}
                sx={{
                  margin: "auto",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ItemCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
