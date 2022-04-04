import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
export default function CategoryAvatars({
  categoryTitle,
  categoryLink,
  imgSource,
  categoryId,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const GoToCategory = async (e) => {
    // TODO add scroll to top
    navigate(categoryLink);
  };
  return (
    <>
      <Box
        component="img"
        sx={{
          bgcolor: "#eceff1",
          borderRadius: "50%",
          boxShadow: 3,
          cursor: "pointer",
          margin: 1,
          width: "90%",
        }}
        alt={
          categoryTitle
            ? "Image of an item from " +
              categoryTitle +
              ", clicking on it will go to that category"
            : "No category title has been provided so a placeholder image has been put in it's place"
        }
        src={imgSource ? imgSource : PF + "logo192.png"}
        onClick={GoToCategory}
      />
      <Typography align="center" fontWeight={"bold"} >
        {categoryTitle ? categoryTitle : "Category"}
      </Typography>
    </>
  );
}
