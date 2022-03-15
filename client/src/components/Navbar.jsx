import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, InputAdornment, TextField } from "@mui/material";
// import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

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

        {/* Search bar desktop */}
        <Grid
          container
          direction={"row"}
          justifyContent="flex-end"
          sx={{ margin: "auto", pr: "5%" }}
        >
          <Grid item>
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
        </Grid>
        {/* Icon menu */}
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
