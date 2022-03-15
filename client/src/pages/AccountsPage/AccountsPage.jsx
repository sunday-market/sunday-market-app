import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

import { Cancel, Delete, Edit, Save } from "@mui/icons-material";

import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  Paper,
  InputLabel,
} from "@mui/material";

const AccountsPage = () => {
  const [username, setUsername] = useState("");

  const [fullName, setFullName] = useState("");
  const [fullNameTemp, setFullNameTemp] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneTemp, setPhoneTemp] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine1Temp, setAddressLine1Temp] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine2Temp, setAddressLine2Temp] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [addressLine3Temp, setAddressLine3Temp] = useState("");

  const [accountDetailsEdit, setAccountDetailsEdit] = useState(false);
  const [accountDetailsError, setAccountDetailsError] = useState("");

  const [email, setEmail] = useState("bob@bob.com");
  const [emailTemp, setEmailTemp] = useState("");
  const [password, setPassword] = useState("123");
  const [passwordTemp, setPasswordTemp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginDetailsEdit, setLoginDetailsEdit] = useState(false);
  const [loginDetailsError, setLoginDetailsError] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/account");

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        //TODO: Add Account API and get details of Account Holder based on the Token
      } catch (error) {
        setError(error.response.data.error);

        setTimeout(() => {
          setError("");
        }, 5000);
      }
    }
  }, [navigate]);

  const editAccountDetailsHandler = () => {
    setFullNameTemp(fullName);
    setAddressLine1Temp(addressLine1);
    setAddressLine2Temp(addressLine2);
    setAddressLine3Temp(addressLine3);
    setPhoneTemp(phone);

    setAccountDetailsEdit(!accountDetailsEdit);
  };

  const cancelAccountDetailsHandler = () => {
    setFullName(fullNameTemp);
    setAddressLine1(addressLine1Temp);
    setAddressLine2(addressLine2Temp);
    setAddressLine3(addressLine3Temp);
    setPhone(phoneTemp);

    setAccountDetailsEdit(!accountDetailsEdit);
  };

  const saveAccountDetailsHandler = () => {

    setTimeout(() => {
      setAccountDetailsError("");
    }, 5000);

    // Check input is valid
    if(!fullName) return setAccountDetailsError("Full Name is required");

    //Clear Temporary Storage
    setFullNameTemp("");
    setAddressLine1Temp("");
    setAddressLine2Temp("");
    setAddressLine3Temp("");
    setPhoneTemp("");

    try {
      //TODO: Update User account in database
    } catch (error) {
      setAccountDetailsError(error.response.data.error);
      setTimeout(() => {
        setAccountDetailsError("");
      }, 5000);
    }
    
    setAccountDetailsEdit(!accountDetailsEdit);
  };

  const editLoginDetailsHandler = () => {
    setEmailTemp(email);
    setPasswordTemp(password);
    setLoginDetailsEdit(!loginDetailsEdit);
  };

  const cancelLoginDetailsHandler = () => {
    setEmail(emailTemp);
    setPassword(passwordTemp);
  
    // Clear temporary storage
    setEmailTemp("");
    setPasswordTemp("");

    setLoginDetailsEdit(!loginDetailsEdit);
  };

  const saveLoginDetailsHandler = () => {
    // Check input is valid
    if (!password || !email) {
      setTimeout(() => {
        setLoginDetailsError("");
      }, 5000);
      return setLoginDetailsError("Please complete all fields");
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setLoginDetailsError("");
      }, 5000);
      return setLoginDetailsError("Passwords do not match");
    }

    try {
      // TODO: Update credentials in Database
    } catch (error) {
      setLoginDetailsError(error.response.data.error);
      setTimeout(() => {
        setLoginDetailsError("");
      }, 5000);
    }

    // Remove auth Token
    localStorage.removeItem("authToken");

    // Redirect to login screen
    navigate("/login");
  };

  const deleteAccountHandler = () => {
    alert("Delete account?");
    //TODO: Create Delete Account Modal

    //TODO: Delete account in database if user selects yes
  };

  return (
    <>
      <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
        <Paper variant="outlined" sx={{ padding: "2em" }}>
          {/* General Errors  */}
          <Grid item>{error && <Alert severity="error">{error}</Alert>}</Grid>

          {/* Account Details  */}
          <Grid container direction="column" spacing={2} marginBottom={8}>
            <Grid item>
              <Typography variant="h4">Account Details</Typography>
            </Grid>

            {/* Username */}
            <Grid
              item
              marginBottom={2}
              padding={3}
              sx={{ background: "#f5f5f5" }}
            >
              <InputLabel>Username</InputLabel>
              <TextField
                disabled={true}
                variant="outlined"
                size="small"
                type="text"
                value={username.toLowerCase()}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                sx={{ background: "white" }}
              />
              <Typography variant="body2">
                Your username is how other users can identify you. It is
                displayed to users when you send messages and interact with
                Sunday Markets. Your username cannot be changed.
              </Typography>
            </Grid>

            {/* Full Name */}
            <Grid item>
              <InputLabel required>Full Name</InputLabel>
              <TextField
                disabled={!accountDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Joe Bloggs"
                sx={{ background: "white" }}
              />
            </Grid>

            {/* Address */}
            <Grid item>
              <InputLabel>Address</InputLabel>
              <TextField
                disabled={!accountDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Street Address"
                sx={{ background: "white" }}
              />
            </Grid>

            <Grid item>
              <TextField
                disabled={!accountDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Suburb"
                sx={{ background: "white" }}
              />
            </Grid>

            <Grid item>
              <TextField
                disabled={!accountDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="text"
                value={addressLine3}
                onChange={(e) => setAddressLine3(e.target.value)}
                placeholder="City/Town"
                sx={{ background: "white" }}
              />
            </Grid>

            {/* Phone */}
            <Grid item>
              <InputLabel>Phone Number</InputLabel>
              <TextField
                disabled={!accountDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+64 21 111 222 333"
                sx={{ background: "white" }}
              />
            </Grid>
            {/* Login Details Errors  */}
            <Grid item>
              {accountDetailsError && (
                <Alert severity="error">{accountDetailsError}</Alert>
              )}
            </Grid>

            {/* Update Account Details Button */}
            <Grid item textAlign={"right"}>
              {!accountDetailsEdit ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={editAccountDetailsHandler}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={cancelAccountDetailsHandler}
                >
                  Cancel
                </Button>
              )}

              <Button
                disabled={!accountDetailsEdit}
                color="success"
                variant="contained"
                startIcon={<Save />}
                onClick={saveAccountDetailsHandler}
              >
                Save
              </Button>
            </Grid>
          </Grid>

          {/* Login Details  */}
          <Grid container direction="column" spacing={2} marginBottom={8}>
            <Grid item>
              <Typography variant="h4">Login Details</Typography>
            </Grid>
            {/* Email */}
            <Grid item>
              <InputLabel required>Email Address</InputLabel>
              <TextField
                disabled={!loginDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                sx={{ background: "white" }}
              />
            </Grid>

            {/* Password */}
            <Grid item>
              <InputLabel required>Password</InputLabel>
              <TextField
                disabled={!loginDetailsEdit}
                variant="outlined"
                fullWidth
                size="small"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                sx={{ background: "white" }}
              />
            </Grid>

            {/* Confirm Password */}
            {loginDetailsEdit && (
              <Grid item>
                <InputLabel required>Confirm your Password</InputLabel>
                <TextField
                  disabled={!loginDetailsEdit}
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  sx={{ background: "white" }}
                />
              </Grid>
            )}

            {/* Login Details Errors  */}
            <Grid item>
              {loginDetailsError && (
                <Alert severity="error">{loginDetailsError}</Alert>
              )}
            </Grid>

            {/* Update Login Details Button */}
            <Grid item textAlign={"right"}>
              {!loginDetailsEdit ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={editLoginDetailsHandler}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={cancelLoginDetailsHandler}
                >
                  Cancel
                </Button>
              )}

              <Button
                disabled={!loginDetailsEdit}
                color="success"
                variant="contained"
                startIcon={<Save />}
                onClick={saveLoginDetailsHandler}
              >
                Save
              </Button>
            </Grid>
          </Grid>

          {/* Delete Account  */}
          <Grid
            container
            direction="column"
            spacing={2}
            marginBottom={1}
            padding={3}
            sx={{ background: "#f5f5f5" }}
          >
            <Grid item>
              <Typography variant="body1">
                Want to delete your account? Deleting your account will remove
                all stalls and products and cannot be undone. If you would only
                like to temporary hide a stall, you can do this in the My Stalls
                page.
              </Typography>
            </Grid>
            <Grid item padding={3} textAlign={"center"}>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                color="error"
                onClick={deleteAccountHandler}
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default AccountsPage;
