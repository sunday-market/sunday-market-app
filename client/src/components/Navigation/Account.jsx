import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";

import { Grid, Typography, Menu, MenuItem, Divider } from "@mui/material";

import DataContext from "../../context/DataContext";

const Account = () => {
  const { loggedInUser, setLoggedInUser, setSuccess } = useContext(DataContext);

  const navigate = useNavigate();

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
    setLoggedInUser(undefined);
    setSuccess("Successfully Logged Out");
    navigate("/");
  };

  return (
    <>
      <Grid item xs={3}>
        <AccountCircleRoundedIcon
          style={{ fontSize: 45, color: "white" }}
          onClick={handleAccClick}
          aria-controls={openAcc ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openAcc ? "true" : undefined}
        />
        <Typography
          variant="body2"
          color="white"
          display={{ xs: "none", sm: "none", md: "block" }}
          align="center"
          width={1}
        >
          {loggedInUser ? loggedInUser.username : "Account"}
          <br />
        </Typography>
      </Grid>

      {loggedInUser ? (
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
          {/* My Account  */}
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/account")}
          >
            <PersonIcon sx={{ pr: 1.5, scale: 2, margin: 0 }} />
            My Account
          </MenuItem>

          {/* Messages  */}
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/account/messages")}
          >
            <MailIcon sx={{ pr: 1.5 }} />
            Messages
          </MenuItem>

          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />

          {/* My Products  */}
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/account/products/myproducts")}
          >
            <Inventory2TwoToneIcon sx={{ pr: 1.5 }} />
            My Products
          </MenuItem>

          {/* My Stalls  */}
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/account/stalls/mystalls")}
          >
            <StorefrontTwoToneIcon sx={{ pr: 1.5 }} />
            My Stalls
          </MenuItem>

          {/* My Orders  */}
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/account/orders/myorders")}
          >
            <ReceiptLongTwoToneIcon sx={{ pr: 1.5 }} />
            My Orders
          </MenuItem>

          {/* Orders Received  */}
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/account/orders/received")}
          >
            <ReceiptIcon sx={{ pr: 1.5 }} />
            Orders Recieved
          </MenuItem>

          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />

          {/* Logout  */}
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
          <MenuItem
            sx={{ color: "white" }}
            onClick={() => navigate("/register")}
          >
            <PersonIcon sx={{ pr: 1.5, scale: 2 }} />
            Sign Up
          </MenuItem>
          <Divider sx={{ bgcolor: "white", width: "80%", margin: "auto" }} />
          <MenuItem sx={{ color: "white" }} onClick={() => navigate("/login")}>
            <LoginRoundedIcon sx={{ pr: 1.5 }} />
            Login
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default Account;
