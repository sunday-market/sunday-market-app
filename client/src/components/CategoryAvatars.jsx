import { CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import DataContext from "../context/DataContext";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

export default function CategoryAvatars({
  category_id,
  categoryTitle,
  categoryLink,
}) {
  const [imgSource, setImageSource] = useState("noimage.jpg");
  const { setError, setLoading } = useContext(DataContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER + "products/";

  const navigate = useNavigate();
  const GoToCategory = async (e) => {
    window.scrollTo({
      top: 0,
      left: 100,
      behavior: "smooth",
    });
    navigate(categoryLink);
  };

  useEffect(() => {
    // Set random images for the avatars
    const handleRandomImage = async () => {
      // get the products associated with the category
      try {
        if (category_id) {
          const products = (
            await axios.get(`/api/product/category/allproducts/${category_id}`)
          ).data.data;
          // check if products has length - if 0 needs a placeholder image
          if (products.length === 0) {
            setImageSource("noimage.jpg");
            return;
          }
          // generate random int from 0 to product length
          const randomInt = Math.floor(Math.random() * products.length);
          // use randomInt to index the products and grab a image
          if (products[randomInt].image === "noimage.jpg") {
            return handleRandomImage();
          }
          setImageSource(products[randomInt].image);
        }
      } catch (error) {
        return setError([error]);
      }
    };
    handleRandomImage();
  }, [category_id, setError, setLoading]);

  return (
    <>
      <CardMedia
        component="img"
        sx={{
          bgcolor: "#eceff1",
          borderRadius: "50%",
          boxShadow: 3,
          cursor: "pointer",
          height: "100%",
          width: "100%",
          aspectRatio: "1 / 1",
        }}
        alt={
          categoryTitle
            ? "Image of an item from " +
              categoryTitle +
              ", clicking on it will go to that category"
            : "No category title has been provided so a placeholder image has been put in it's place"
        }
        image={imgSource ? PF + imgSource : PF + "logo192.png"}
        onClick={GoToCategory}
      />
      <Typography align="center" fontWeight={"bold"}>
        {categoryTitle ? categoryTitle : "Category"}
      </Typography>
    </>
  );
}
