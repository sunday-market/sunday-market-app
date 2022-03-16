import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
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
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

// IMPORTANT
// Navbar still needs to adjust for smaller screens
// possible solution to scale the whole navbar
// issue occurs at 440px or less
// IMPORTANT

export default function Navbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const userData = useUser();

  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    function handleLoggedInStatus() {
      setUserToken(localStorage.getItem("authToken"));
    }
    handleLoggedInStatus();
  });

  // Shopping dropdown
  const [anchorShopping, setAnchorShopping] = useState(null);
  const openShopping = Boolean(anchorShopping);
  const handleShoppingClick = (event) => {
    setAnchorShopping(event.currentTarget);
  };
  const handleShoppingClose = () => {
    setAnchorShopping(null);
  };

  // Category dropdown
  const [anchorCategory, setAnchorCategory] = useState(null);
  const openCategory = Boolean(anchorCategory);
  const handleCategoryClick = (event) => {
    setAnchorCategory(event.currentTarget);
  };
  const handleCategoryClose = () => {
    setAnchorCategory(null);
  };

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
  const HandleLogout = () => {
    localStorage.removeItem("authToken");
    setUserToken(null);
  };

  // this will adjust the screen size accordinly
  const windowSize = useIsMobileScreen(700);

  // navigate to click handler functions
  const navigate = useNavigate();
  const navigateToAccount = () => {
    navigate("/account");
  };
  const navigateToRegister = () => {
    navigate("/register");
  };
  const navigateToLogin = () => {
    navigate("/login");
  };

  // Search submit
  const onSearchSubmit = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      console.log(`Search submit`);
      console.log(e.target.value);
    }
  };

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
                placeholder="Search..."
                onKeyDown={onSearchSubmit}
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
            <IconButton
              sx={{ pl: 3 }}
              onClick={handleCategoryClick}
              aria-controls={openCategory ? "category-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openCategory ? "true" : undefined}
            >
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
            <IconButton
              sx={{ margin: 1 }}
              onClick={handleShoppingClick}
              aria-controls={openAcc ? "shopping-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openAcc ? "true" : undefined}
            >
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
      {userToken ? (
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
          <MenuItem sx={{ color: "white" }} onClick={navigateToAccount}>
            <PersonIcon sx={{ pr: 1.5, scale: 2, margin: 0 }} />
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
          <MenuItem sx={{ color: "white" }} onClick={HandleLogout}>
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
          <MenuItem sx={{ color: "white" }} onClick={navigateToRegister}>
            <PersonIcon sx={{ pr: 1.5, scale: 2 }} />
            Sign Up
          </MenuItem>
          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
          <MenuItem sx={{ color: "white" }} onClick={navigateToLogin}>
            <LoginRoundedIcon sx={{ pr: 1.5 }} />
            Login
          </MenuItem>
        </Menu>
      )}
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
        {Array.from(Array(5)).map((_, index) => (
          <MenuItem sx={{ color: "white" }}>
            <PersonIcon sx={{ pr: 1.5, scale: 2 }} />
            Category
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={anchorShopping}
        id="shopping-menu"
        open={openShopping}
        onClose={handleShoppingClose}
        onClick={handleShoppingClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",

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
        {Array.from(Array(5)).map((_, index) => (
          <Box
            container
            direction={"row"}
            justifyContent="center"
            alignContent={"center"}
            width={"100%"}
          >
            <MenuItem sx={{ color: "white" }} width={"100%"}>
              <Box
                component={"img"}
                sx={{ maxHeight: 60, maxWidth: 80 }}
                alt={"This product image of the shopping cart"}
                src={
                  "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                }
              />
              <Typography paddingLeft={2} sx={{ width: "100%" }}>
                Shopping cart details..
              </Typography>
              <Typography paddingLeft={2}>QTY</Typography>
              <Typography paddingLeft={2}>$00.00</Typography>
            </MenuItem>
          </Box>
        ))}
        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
        <Box
          container
          direction={"row"}
          justifyContent="center"
          alignContent={"center"}
          sx={{
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "white",
              margin: "auto",
              textAlign: "center",
            }}
          >
            Time Remaining:
          </Typography>
          <Box
            justifyContent="center"
            alignContent={"center"}
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <IconButton sx={{ margin: "auto", marginRight: 0 }}>
              <RefreshRoundedIcon />
            </IconButton>
            <Typography
              sx={{
                pl: 1,
                color: "white",
                margin: "auto",
                marginLeft: 0,
              }}
            >
              00.00.00s
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
        <Box
          justifyContent="center"
          alignContent={"center"}
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              margin: 2,
              marginBottom: 0.5,
              border: 1,
              boxShadow: 2,
            }}
          >
            Clear
          </Button>
          <Box width={"10%"} />
          <Button
            variant="contained"
            sx={{
              borderRadius: 4,
              margin: 2,
              marginBottom: 0.5,
              border: 0,
              boxShadow: 2,
            }}
          >
            Place Order
          </Button>
        </Box>
      </Menu>
    </>
  );
}
