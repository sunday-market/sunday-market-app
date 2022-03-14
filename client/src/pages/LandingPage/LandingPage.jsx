import React from "react";
import { Box, Grid } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import "./landingPage.css";

const CardArray = [
  {
    textId: "1",
    text: "Card 1",
  },
  {
    textId: "2",
    text: "Card 2",
  },
  {
    textId: "3",
    text: "Card 3",
  },
  {
    textId: "4",
    text: "Card 4",
  },
  {
    textId: "5",
    text: "Card 5",
  },
];

const LandingPage = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: "1% 2%",
        maxwidth: "100%",
        bgcolor: "#f5f5f5",
      }}
    >
      <div>Landing Page</div>
      <Grid>
        <Box sx={{ bgcolor: "blue", width: 800, height: 800 }}>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            enableMouseEvents
          >
            {CardArray.map((c) => (
              <div key={c.textId}>{c.text}</div>
            ))}
          </SwipeableViews>
        </Box>
      </Grid>
    </Box>
  );
};

export default LandingPage;
