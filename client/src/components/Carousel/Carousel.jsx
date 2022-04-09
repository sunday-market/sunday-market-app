import { useState, useCallback, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Paper,
  Card,
  Typography,
  Grid,
  CardMedia,
  CardContent,
} from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import DataContext from "../../context/DataContext";

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 3 },
};
const handleOnClick = () => {
  console.log("clicked");
};
const items = [
  <Box
    height={300}
    backgroundColor={"red"}
    className="item"
    data-value="1"
    onClick={handleOnClick}
  >
    <Box component={"img"} />
  </Box>,
  <Box
    height={300}
    backgroundColor={"blue"}
    className="item"
    data-value="2"
    onClick={handleOnClick}
  >
    <Box component={"img"} onClick={handleOnClick} />
  </Box>,
  <Box
    height={300}
    backgroundColor={"green"}
    className="item"
    data-value="3"
    onClick={handleOnClick}
  >
    <Box component={"img"} onClick={handleOnClick} />
  </Box>,
  <Box
    height={300}
    backgroundColor={"yellow"}
    className="item"
    data-value="4"
    onClick={handleOnClick}
  >
    <Box component={"img"} />
  </Box>,
  <Box
    height={300}
    backgroundColor={"orange"}
    className="item"
    data-value="5"
    onClick={() => console.log("clicked")}
  >
    <Box component={"img"} />
  </Box>,
];

export default function Carousel({ products }) {
  const { setLoading, error } = useContext(DataContext);

  useEffect(() => {
    items.forEach((item) => {
      //item.props.backgroundColor = "blue";
    });
  }, []);
  const handleOnClick = () => {
    console.log("clicked");
  };

  return (
    <>
      <AliceCarousel
        mouseTracking
        autoPlayInterval={3000}
        autoPlay={true}
        infinite={true}
        items={items}
        responsive={responsive}
        controlsStrategy="alternate"
      />
    </>
  );
}
