import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined"; // This is for when a timer on the cart is going to run out
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import PersonIcon from "@mui/icons-material/Person";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { useIsMobileScreen } from "../hooks/useIsMobileScreen";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../hooks/useUser";

// IMPORTANT
// Navbar still needs to adjust for smaller screens
// possible solution to scale the whole navbar
// issue occurs at 440px or less
// IMPORTANT

export default function Navbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const userData = useUser();

  // Acounts dropdown
  const [anchorAcc, setAnchorAcc] = useState(null);
  const openAcc = Boolean(anchorAcc);
  const handleAccClick = (event) => {
    setAnchorAcc(event.currentTarget);
  };
  const handleAccClose = () => {
    setAnchorAcc(null);
  };

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
  };

  // this will adjust the screen size accordinly
  const windowSize = useIsMobileScreen(700);

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
          {windowSize && (
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
            <IconButton
              sx={{ pl: 3 }}
              onClick={handleAccClick}
              aria-controls={openAcc ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openAcc ? "true" : undefined}
            >
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
          {!windowSize && (
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
      {/* Account menu */}
      {userData ? (
        <Menu
          anchorEl={anchorAcc}
          id="account-menu"
          open={openAcc}
          onClose={handleAccClose}
          onClick={handleAccClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
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
          <MenuItem sx={{ color: "white" }}>
            <PersonIcon sx={{ pr: 1.5, scale: 2 }} />
            My Account
          </MenuItem>
          <MenuItem sx={{ color: "white" }}>
            <MailIcon sx={{ pr: 1.5 }} />
            Messages
          </MenuItem>
          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
          <MenuItem sx={{ color: "white" }}>
            <ReceiptIcon sx={{ pr: 1.5 }} />
            Orders Recieved
          </MenuItem>
          <MenuItem sx={{ color: "white" }}>
            <ReceiptLongTwoToneIcon sx={{ pr: 1.5 }} />
            My Orders
          </MenuItem>
          <MenuItem sx={{ color: "white" }}>
            <StorefrontTwoToneIcon sx={{ pr: 1.5 }} />
            My Stalls
          </MenuItem>
          <MenuItem sx={{ color: "white" }}>
            <Inventory2TwoToneIcon sx={{ pr: 1.5 }} />
            My Products
          </MenuItem>
          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
          <MenuItem sx={{ color: "white" }} onClick={handleLogout}>
            <LogoutRoundedIcon sx={{ pr: 1.5 }} />
            Logout
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={anchorAcc}
          id="account-menu"
          open={openAcc}
          onClose={handleAccClose}
          onClick={handleAccClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
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
          <MenuItem sx={{ color: "white" }}>
            <PersonIcon sx={{ pr: 1.5, scale: 2 }} />
            Sign Up
          </MenuItem>
          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
          <MenuItem sx={{ color: "white" }}>
            <LoginRoundedIcon sx={{ pr: 1.5 }} />
            Login
          </MenuItem>
        </Menu>
      )}
    </>
  );
}
