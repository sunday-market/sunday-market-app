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
import CarouselCard from "./CarouselCard";
import DataContext from "../../context/DataContext";

const responsive = {
  600: { items: 1 },
  800: { items: 2 },
  1024: { items: 3 },
};

export default function Carousel({ products }) {
  const { setLoading, error } = useContext(DataContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([]);
    let allowedToRender = true;
    if (allowedToRender) {
      setLoading(true);
      products.forEach((product, index) => {
        setItems((prev) => [
          ...prev,
          <CarouselCard product={product} index={index} />,
        ]);
      });
    }
    setLoading(false);
    allowedToRender = false;
  }, [products, setLoading]);

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
