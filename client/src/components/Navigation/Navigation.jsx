import { Grid } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";

// Navigation Icons
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";

// Search Adordment Icon
import SearchIcon from "@mui/icons-material/Search";

// Menu Icons

import { TextField, Typography, InputAdornment } from "@mui/material";

import Logo from "../../assets/logo-transparent.png";
import { Box } from "@mui/system";

import DataContext from "../../context/DataContext";

import Categories from "./Categories";
import Support from "./Support";
import Account from "./Account";
import MenuShoppingCart from "../../components/ShoppingCart/MenuShoppingCart";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setError, loggedInUser, shoppingCart } = useContext(DataContext);
  const navigate = useNavigate();

  // Search submit
  const onSearchSubmit = async (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim().length < 2) {
        setError("Search term must be at least 2 characters");
        return setSearchQuery(searchQuery.trim());
      }

      navigate(`/search/results/?q=${searchQuery.trim()}`);
    }
  };

  return (
    <>
      {/* Top Navigation  */}
      <Grid
        container
        alignItems="center"
        p={1}
        px={2}
        backgroundColor="#03a9f4"
      >
        {/* Logo  */}
        <Grid
          item
          xs={4}
          sm={2}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Sunday Market Logo"
            width="90%"
            sx={{
              maxWidth: 200,
            }}
          />
        </Grid>

        {/* Search  */}
        <Grid item xs={12} sm={6} order={{ xs: 2, sm: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            autoFocus
            placeholder="Search..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onSearchSubmit}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: "white" }}
          />
        </Grid>

        {/* Menu Items  */}
        <Grid item xs={8} sm={4} order={{ xs: 1, sm: 2 }}>
          <Grid container alignItems="center" align="center">
            <Categories />
            <Support />
            <Account />

            {/* Shopping Cart  */}
            <Grid item xs={3}>
              <MenuShoppingCart />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Bottom Navigation */}
      <Grid container backgroundColor="#0388d1" p={{ xs: 2, sm: 3 }}></Grid>
    </>
  );
};

export default Navigation;
