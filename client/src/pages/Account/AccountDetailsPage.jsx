import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import axios from "axios";

import { Cancel, Delete, Edit, Save } from "@mui/icons-material";

import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  InputLabel,
  Modal,
  Divider,
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

  const [email, setEmail] = useState("");
  const [emailTemp, setEmailTemp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePasswordError, setChangePasswordError] = useState("");

  const [success, setSuccess] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
  const [error, setError] = useState("");

  // Delete Account Modal State
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const fetchCurrentUser = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        try {
          const decodedJWT = await jwt(localStorage.getItem("authToken"));
          const currentUser = await axios.get(
            `/api/user/${decodedJWT.id}`,
            config
          );

          const user = currentUser.data.data;

          setUsername(user.username || "");
          setFullName(user.fullname || "");
          setEmail(user.email || "");
          setAddressLine1(user.addressLine1 || "");
          setAddressLine2(user.addressLine2 || "");
          setAddressLine3(user.addressLine3 || "");
          setPhone(user.phone || "");
        } catch (error) {
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login");
          }
          setError(error.response.data.error);

          setTimeout(() => {
            setError("");
          }, 5000);
        }
      };
      fetchCurrentUser();
    }
  }, [navigate]);

  const editAccountDetailsHandler = () => {
    setFullNameTemp(fullName);
    setEmailTemp(email);
    setAddressLine1Temp(addressLine1);
    setAddressLine2Temp(addressLine2);
    setAddressLine3Temp(addressLine3);
    setPhoneTemp(phone);

    setAccountDetailsEdit(!accountDetailsEdit);
  };

  const cancelAccountDetailsHandler = () => {
    setFullName(fullNameTemp);
    setEmail(emailTemp);
    setAddressLine1(addressLine1Temp);
    setAddressLine2(addressLine2Temp);
    setAddressLine3(addressLine3Temp);
    setPhone(phoneTemp);

    setAccountDetailsEdit(!accountDetailsEdit);
  };

  const saveAccountDetailsHandler = async () => {
    setTimeout(() => {
      setAccountDetailsError("");
    }, 5000);

    // Check input is valid
    if (!fullName) return setAccountDetailsError("Full Name is required");
    if (!email) return setAccountDetailsError("Email is required");

    //Clear Temporary Storage
    setFullNameTemp("");
    setEmailTemp("");
    setAddressLine1Temp("");
    setAddressLine2Temp("");
    setAddressLine3Temp("");
    setPhoneTemp("");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const decodedJWT = await jwt(localStorage.getItem("authToken"));

      //Update User account in database
      await axios.put(
        `/api/user/${decodedJWT.id}`,
        {
          fullname: fullName,
          email: email,
          address_line1: addressLine1,
          address_line2: addressLine2,
          address_line3: addressLine3,
          phone,
        },
        config
      );

      // Success Alert
      setSuccess("Account details successfully updated");
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      setAccountDetailsError(error.response.data.error);
      setTimeout(() => {
        setAccountDetailsError("");
      }, 5000);
    }

    setAccountDetailsEdit(!accountDetailsEdit);
  };

  const changePasswordHandler = async () => {
    if (!currentPassword) {
      setTimeout(() => {
        setChangePasswordError("");
      }, 5000);
      return setChangePasswordError(
        "Please enter your current (existing) password"
      );
    }

    if (!newPassword) {
      setTimeout(() => {
        setChangePasswordError("");
      }, 5000);
      return setChangePasswordError("Please enter your new password");
    }

    // Check new passwords match
    if (newPassword !== confirmPassword) {
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setChangePasswordError("");
      }, 5000);
      return setChangePasswordError("Passwords do not match");
    }

    try {
      const decodedJWT = await jwt(localStorage.getItem("authToken"));

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Update Password Credentials in Database
      await axios.put(
        "/api/auth/changepassword",
        {
          userId: decodedJWT.id,
          existingPassword: currentPassword,
          newPassword,
        },
        config
      );

      // Display Success Message
      setPasswordChangeSuccess(
        "Password Changed.  You will be redirected to login shortly"
      );

      // Redirect user to login after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess("");
        localStorage.removeItem("authToken");
        navigate("/login");
      }, 3000);
    } catch (error) {
      setChangePasswordError(error.response.data.error);
      setTimeout(() => {
        setChangePasswordError("");
      }, 5000);
    }
  };

  const deleteAccountHandler = async () => {
    // Delete account in database if user selects yes
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const decodedJWT = await jwt(localStorage.getItem("authToken"));
    await axios.delete(`/api/user/${decodedJWT.id}`, config);

    // Remove auth token
    localStorage.removeItem("authToken");

    // redirect to account deleted page
    navigate("/accountdeleted");
  };

  return (
    <Box px={{ xs: 2, sm: 8, md: 22 }} py={4}>
      {/* General Errors  */}
      <Grid item>{error && <Alert severity="error">{error}</Alert>}</Grid>

      {/* Account Details  */}
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h4">Account Details</Typography>
        </Grid>

        <Grid item mb={2}>
          <Divider />
        </Grid>

        <Grid item>
          <Typography variant="body1">
            The details of your account are listed below. You can update your
            details if they are incorrect. Please note you are unable to change
            your username and email address.{" "}
          </Typography>
        </Grid>

        <Grid item my={1} />

        {/* Full Name */}
        <Grid item p={1} py={3}>
          <InputLabel required>Name</InputLabel>
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

        {/* Username */}
        <Grid item p={1}>
          <InputLabel>Username</InputLabel>

          <TextField
            disabled={true}
            fullWidth
            variant="outlined"
            size="small"
            type="text"
            value={username.toLowerCase()}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Email */}
        <Grid item p={1}>
          <InputLabel required>Email Address</InputLabel>
          <TextField
            disabled
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

        {/* Phone */}
        <Grid item p={1}>
          <InputLabel>Phone Number</InputLabel>
          <TextField
            disabled={!accountDetailsEdit}
            variant="outlined"
            size="small"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+64 21 111 222 333"
            sx={{ background: "white", maxWidth: "30char" }}
          />
        </Grid>

        <Grid item my={2}></Grid>

        {/* Address */}
        <Grid item px={1}>
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

        <Grid item p={1}>
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

        <Grid item px={1}>
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

        {/* Alert Messages  */}
        <Grid item>
          {success && <Alert severity="success">{success}</Alert>}
          {accountDetailsError && (
            <Alert severity="error">{accountDetailsError}</Alert>
          )}
        </Grid>

        {/* Update Account Details Button */}
        <Grid item textAlign={"right"} m={0} p={2}>
          {!accountDetailsEdit ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={editAccountDetailsHandler}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                disabled={!accountDetailsEdit}
                color="success"
                variant="contained"
                startIcon={<Save />}
                onClick={saveAccountDetailsHandler}
                sx={{ marginRight: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={cancelAccountDetailsHandler}
                style={{ color: "grey", borderColor: "grey" }}
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {/* Change Password  */}
      <form>
        <Grid container direction="column" marginBottom={8}>
          <Grid item>
            <Typography variant="h5">Change Password</Typography>
            <Typography variant="body2" mb={1}>
              To create a new password, enter your exisiting password and type
              the new password in the below text fields. Please note that
              changing your password will log you out.
            </Typography>
          </Grid>

          <Grid item p={1}>
            <InputLabel>Enter Current Password</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              sx={{ background: "white" }}
            />
          </Grid>

          <Grid item p={1}>
            <InputLabel>New Password</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Confirm Password  */}
          <Grid item p={1}>
            <InputLabel>Confirm your Password</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Update Successful Message  */}
          <Grid item>
            {passwordChangeSuccess && (
              <Alert severity="success">{passwordChangeSuccess}</Alert>
            )}
          </Grid>

          {/* Change Password Errors  */}
          <Grid item>
            {changePasswordError && (
              <Alert severity="error">{changePasswordError}</Alert>
            )}
          </Grid>

          {/* Change Password Button */}
          <Grid item textAlign={"center"}>
            <Button
              variant="contained"
              size="small"
              onClick={changePasswordHandler}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </form>
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
          <Typography variant="body2">
            <b>Want to delete your account?</b> You will loose access to all
            your stalls and products. If you would like to take a break, you can
            hide a stall from the My Stalls page.
          </Typography>
        </Grid>
        <Grid item padding={3} textAlign={"center"}>
          <Button
            startIcon={<Delete />}
            color="error"
            onClick={handleOpenDeleteModal}
          >
            Delete Account
          </Button>
          <Typography variant="body2" color="error" align="center" mt={2}>
            Please be sure as we are not able to restore deleted accounts.
          </Typography>
        </Grid>
      </Grid>

      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Account?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
            Are you sure you want to delete your account? If you delete your
            account you will no longer have access to your products and
            services.
            <b>Deleting accounts cannot be undone.</b>
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={{ mr: 1 }}
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </Button>
          <Button
            size="large"
            variant="outlined"
            color="error"
            onClick={deleteAccountHandler}
          >
            Confirm Delete
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AccountsPage;
