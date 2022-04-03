import { Grid } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router";

// Navigation Icons
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

// Search Adordment Icon
import SearchIcon from "@mui/icons-material/Search";

// Menu Icons

import { TextField, Typography, InputAdornment } from "@mui/material";

import Logo from "../../assets/logo-transparent.png";
import { Box } from "@mui/system";

import DataContext from "../../context/DataContext";

const Navigation = () => {
  const { categories, loggedInUser, shoppingCart } = useContext(DataContext);
  const navigate = useNavigate();

  return (
    <>
      {/* Top Navigation  */}
      <Grid
        container
        backgroundColor="#03a9f4"
        p={1}
        color="white"
        alignItems="center"
        align="center"
      >
        {/* Logo  */}
        <Grid item xs={2}>
          <Box
            component="img"
            src={Logo}
            alt="Sunday Market Logo"
            display="block"
            width="70%"
            p={1}
          />
        </Grid>

        {/* Search  */}
        <Grid item flexGrow={1} xs={6} px={2}>
          <TextField
            variant="outlined"
            autoFocus
            placeholder="Search..."
            fullWidth
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

        {/* Categories */}
        <Grid item xs={1}>
          <FilterAltRoundedIcon
            style={{ fontSize: 45, color: "white" }}
            onClick={() => navigate("/support")}
          />
          <Typography variant="body2" color="white">
            Categories
          </Typography>
        </Grid>

        {/* Account */}
        <Grid item xs={1}>
          <AccountCircleRoundedIcon style={{ fontSize: 45, color: "white" }} />
          <Typography variant="body2" color="white">
            {loggedInUser ? loggedInUser.username : "Account"}
            <br />
            {loggedInUser && loggedInUser.fullname}
          </Typography>
        </Grid>

        {/* Help */}
        <Grid item xs={1}>
          <HelpOutlineIcon style={{ fontSize: 45, color: "white" }} />
          <Typography variant="body2" color="white">
            Support
          </Typography>
        </Grid>

        {/* Categories */}
        <Grid item xs={1}>
          <Typography variant="body2" color="white">
            Shopping Cart
          </Typography>
          <Typography variant="body2" color="white">
            Total Items: {shoppingCart?.products_selected.length}
          </Typography>
        </Grid>
      </Grid>

      {/* Bottom Navigation */}
      <Grid container backgroundColor="#0388d1" p={2}></Grid>
    </>
  );
};

export default Navigation;
