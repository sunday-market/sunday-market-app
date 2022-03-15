import { Box, Typography } from "@mui/material";
import "./landingPage.css";
import Carousel from "../../components/Carousel";
import ItemCard from "../../components/ItemCard";
import CategoryAvatars from "../../components/CategoryAvatars";
import { useIsMobleScreen } from "../../hooks/useIsMobleScreen";

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
  // this will adjust the screen size accordinly
  const windowSize = useIsMobleScreen();

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
        {windowSize && <Carousel Cards={CardArray} />}
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
        {/* Item Cards of recently added */}
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {Array.from(Array(4)).map((_, index) => (
            <Box
              item
              key={index}
              sx={{
                margin: "auto",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
              }}
            >
              <ItemCard />
            </Box>
          ))}
        </Box>
        {/* Category Avatars */}
        {windowSize && (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {Array.from(Array(12)).map((_, index) => (
              <Box
                item
                key={index}
                sx={{
                  margin: "auto",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                }}
              >
                <CategoryAvatars />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
