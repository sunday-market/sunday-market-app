import SearchIcon from "@mui/icons-material/Search";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined"; // This is for when a timer on the cart is going to run out
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // this will adjust the screen size accordinly
  const [isNotMobile, setIsNotMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleWindowResize() {
        setIsNotMobile(window.screen.width > 700);
      }
      // add window resize event
      window.addEventListener("resize", handleWindowResize);

      // call handle
      handleWindowResize();
    }
  }, []);

  return (
    <>
      {/* Top menu bar */}
      <Box
        sx={{
          width: "100%",
          minHeight: 60,
          maxHeight: 120,
          margin: 0,
          p: 0,
          pt: 1,
          pb: 0.5,
          bgcolor: "#03a9f4",
          position: "relative",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid
          container
          direction={"row"}
          justifyContent="flex-end"
          alignContent={"center"}
          sx={{ margin: "auto", pr: "5%" }}
        >
          <Grid
            item
            justifyContent={"center"}
            alignContent={"center"}
            sx={{ margin: 0, p: 0 }}
          >
            <NavLink to="/">
              <Box
                component="img"
                src={PF + "Sunday Markets-logos_white.png"}
                sx={{
                  minHeight: 60,
                  maxHeight: 60,
                  marginLeft: 2,
                }}
              />
            </NavLink>
          </Grid>
          {/* Search bar desktop */}
          {isNotMobile && (
            <Grid
              item
              alignContent={"center"}
              sx={{ margin: "auto", width: "35%" }}
            >
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                sx={{ bgcolor: "#eceff1" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
          )}
          {/* Icon menu */}
          {/* Categories */}
          <Grid
            item
            justifyContent={"center"}
            alignContent={"center"}
            sx={{ margin: "auto", marginRight: "1%" }}
          >
            <IconButton sx={{ pl: 3 }}>
              <FilterAltRoundedIcon
                sx={{
                  transform: "scale(2)",
                  color: "#eceff1",
                  margin: "auto",
                }}
              />
            </IconButton>
            <Typography
              sx={{ fontSize: "12px", color: "white", pl: 1.5, margin: "auto" }}
            >
              Category
            </Typography>
          </Grid>
          {/* Account */}
          <Grid
            item
            justifyContent={"center"}
            alignContent={"center"}
            sx={{ margin: "auto", marginLeft: "1%", marginRight: "3%" }}
          >
            <IconButton sx={{ pl: 3 }}>
              <AccountCircleRoundedIcon
                sx={{
                  transform: "scale(2)",
                  color: "#eceff1",
                  margin: "auto",
                }}
              />
            </IconButton>
            <Typography
              sx={{ fontSize: "12px", color: "white", pl: 1.5, margin: "auto" }}
            >
              Account
            </Typography>
          </Grid>

          {/* Shopping Cart */}
          <Grid
            item
            justifyContent={"center"}
            alignContent={"center"}
            sx={{
              margin: 0,
              bgcolor: "#0288d1",
              borderRadius: 2,
              maxHeight: 60,
            }}
          >
            <IconButton sx={{ margin: 1 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "white",
                  pr: 3.5,
                  margin: 0,
                }}
              >
                $0.00
              </Typography>
              <ShoppingCartTwoToneIcon
                sx={{
                  transform: "scale(1.6)",
                  color: "#eceff1",
                  margin: "auto",
                }}
              />
            </IconButton>
          </Grid>
          <Box width={"100%"} />
          {!isNotMobile && (
            <Grid
              item
              alignContent={"center"}
              sx={{
                margin: "auto",
                width: "100%",
                marginLeft: 2,
                marginRight: 0,
                pt: 1,
                pb: 1,
              }}
            >
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                sx={{ bgcolor: "#eceff1" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
          )}
        </Grid>
      </Box>
      {/* Bottom menu bar */}
      <Box
        sx={{
          width: "100%",
          minHeight: 40,
          maxHeight: 60,
          bgcolor: "#0288d1",
        }}
      />
    </>
  );
}
