import { Box, Typography } from "@mui/material";

export default function CategoryAvatars({
  categoryTitle,
  categoryLink,
  imgSource,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const GoToCategory = async (e) => {
    console.log("Go To Category");
  };
  return (
    <>
      <Box
        component="img"
        sx={{
          bgcolor: "#eceff1",
          height: "100%",
          minWidth: "100%",
          maxHeight: 180,
          maxWidth: 180,
          borderRadius: "50%",
          boxShadow: 3,
          cursor: "pointer",
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
      <Typography align="center">
        {categoryTitle ? categoryLink : "Category"}
      </Typography>
    </>
  );
}
