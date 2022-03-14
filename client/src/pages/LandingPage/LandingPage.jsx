import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "./landingPage.css";
import Carousel from "../../components/Carousel";
import ItemCard from "../../components/ItemCard";
import CategoryAvatars from "../../components/CategoryAvatars";

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
  const [isNotMobile, setIsNotMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleWindowResize() {
        setIsNotMobile(window.screen.width > 600);
      }
      // add window resize event
      window.addEventListener("resize", handleWindowResize);

      // call handle
      handleWindowResize();
    }
  }, []);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
      <Box component="img" src={PF + "logo192.png"} sx={{ width: 100 }} />
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
        {isNotMobile && <Carousel Cards={CardArray} />}
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
        {isNotMobile && (
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
