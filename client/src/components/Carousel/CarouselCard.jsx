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

import React from "react";

export default function CarouselCard({ product, index }) {
  const handleOnClick = () => {
    console.log("clicked slide");
  };
  return (
    <Box
      height={300}
      backgroundColor={"red"}
      className="item"
      data-value={index}
      onClick={handleOnClick}
    >
      <Box component={"img"} />
    </Box>
  );
}
