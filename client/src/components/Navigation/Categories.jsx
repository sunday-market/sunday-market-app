import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, Typography, Menu, MenuItem } from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";

import DataContext from "../../context/DataContext";

const Categories = () => {
  const { categories } = useContext(DataContext);
  const [anchorCategory, setAnchorCategory] = useState(null);
  const openCategory = Boolean(anchorCategory);
  const navigate = useNavigate();

  const handleCategoryClick = (event) => {
    setAnchorCategory(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorCategory(null);
  };

  const handleSelectCategory = (categoryId) => {
    navigate(`search/category/${categoryId}`);
  };

  return (
    <>
      <Grid item xs={3} sx={{ cursor: "pointer" }}>
        <FilterAltRoundedIcon
          onClick={handleCategoryClick}
          aria-controls={openCategory ? "category-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openCategory ? "true" : undefined}
          style={{ fontSize: 45, color: "white" }}
        />
        <Typography
          variant="body2"
          color="white"
          display={{ xs: "none", sm: "none", md: "block" }}
        >
          Categories
        </Typography>
      </Grid>

      <Menu
        anchorEl={anchorCategory}
        id="category-menu"
        open={openCategory}
        onClose={handleCategoryClose}
        onClick={handleCategoryClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            bgcolor: "#03a9f4",
            boxShadow: 5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "#03a9f4",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Categories Menu */}
        {categories?.map((category) => (
          <MenuItem
            sx={{ color: "white", px: 4 }}
            key={category._id}
            onClick={() => handleSelectCategory(category._id)}
          >
            {category.category_name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Categories;
