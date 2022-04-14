import { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
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
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/products/${product._id}`);
  };
  return (
    <Box boxShadow={3} className="item" data-value={index} p={2} m={1}>
      <Typography textTransform={"capitalize"} sx={{ fontWeight: 700 }}>
        {product.product_name}
      </Typography>
      <CardMedia
        onClick={handleOnClick}
        component="img"
        height="275"
        image={
          product.image
            ? `${PF}products/${product.image}`
            : `${PF}products/noimage.jpg`
        }
        alt={product.product_name}
        sx={{
          boxShadow: "0px 5px 20px 2px rgba(64,64,64,0.35);",
          cursor: "pointer",
        }}
      />
    </Box>
  );
}
