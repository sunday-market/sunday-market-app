import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
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

import DataContext from "../../context/DataContext";

const AccountsPage = () => {
  const { setLoading, error, setError, setSuccess } = useContext(DataContext);

  const [tempUser, setTempUser] = useState({});

  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [editAccount, setEditAccount] = useState(false);

  // Delete Account Modal State
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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

  // Get the User
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    (async () => {
      const decodedJWT = jwtDecode(localStorage.getItem("authToken"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
      };

      await axios
        .get(`/api/user/${decodedJWT.id}`, config)
        .then((result) => {
          const user = result.data.data;

          setUsername(user?.username);
          setFullName(user?.fullname);
          setEmail(user?.email);
          setPhone(user?.phone);
          setAddressLine1(user?.address_line1);
          setAddressLine2(user?.address_line2);
          setAddressLine3(user?.address_line3);
        })
        .catch((error) => {
          setError(error.response);
        });
    })();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [setError, setLoading]);

  const handleCancel = () => {
    setFullName(tempUser.fullname);
    setEmail(tempUser.email);
    setPhone(tempUser.phone);
    setAddressLine1(tempUser.address_line1);
    setAddressLine2(tempUser.address_line2);
    setAddressLine3(tempUser.address_line3);
    setEditAccount(false);
  };

  const handleEdit = () => {
    setTempUser({
      fullname,
      email,
      phone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      address_line3: addressLine3,
    });
    setEditAccount(true);
  };

  const handleSave = async () => {
    const controller = new AbortController();
    setLoading(true);

    // Check input is valid
    if (!fullname) {
      setLoading(false);
      return setError("Full Name is required");
    }

    if (!email) {
      setLoading(false);
      return setError("Email is required");
    }

    setTempUser({});

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };

    const decodedJWT = jwtDecode(localStorage.getItem("authToken"));

    await axios
      .put(
        `/api/user/${decodedJWT.id}`,
        {
          fullname,
          email,
          phone,
          address_line1: addressLine1,
          address_line2: addressLine2,
          address_line3: addressLine3,
        },
        config
      )
      .then((result) => {
        setSuccess("Account details successfully updated");
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.error);
        setLoading(false);
        setEditAccount(!editAccount);
        controller.abort();
      });

    return controller.abort();
  };

  const handleChangePassword = async () => {
    const controller = new AbortController();
    setLoading(true);

    if (!currentPassword) {
      setLoading(false);
      controller.abort();
      return setError("Please enter your current (existing) password");
    }

    if (!newPassword) {
      setLoading(false);
      controller.abort();
      return setError("Please enter your new password");
    }

    // Check new passwords match
    if (newPassword !== confirmPassword) {
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      controller.abort();
      return setError("Passwords do not match");
    }

    const decodedJWT = jwtDecode(localStorage.getItem("authToken"));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };

    // Update Password Credentials in Database
    await axios
      .put(
        "/api/auth/changepassword",
        {
          userId: decodedJWT.id,
          existingPassword: currentPassword,
          newPassword,
        },
        config
      )
      .then(() => {
        setSuccess("Password Successfully Changed");
        localStorage.removeItem("authToken");
      })
      .catch((error) => {
        setError(error.response);
        setLoading(false);
        controller.abort();
      });

    setLoading(false);
    return controller.abort();
  };

  const deleteAccountHandler = async () => {
    const controller = new AbortController();
    setLoading(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.abort,
    };

    const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));
    await axios
      .delete(`/api/user/${decodedJWT.id}`, config)
      .then(() => {
        localStorage.removeItem("authToken");
      })
      .catch((error) => {
        setError(error.response.data.error);
        setLoading(false);
        controller.abort();
      });

    setLoading(false);

    controller.abort();

    return navigate("/accountdeleted");
  };

  return (
    <Box px={{ xs: 2, sm: 8, md: 22 }} py={4}>
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
            name="fullname"
            disabled={!editAccount}
            variant="outlined"
            fullWidth
            size="small"
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Joe Bloggs"
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Username */}
        <Grid item p={1}>
          <InputLabel>Username</InputLabel>

          <TextField
            name="username"
            disabled={true}
            fullWidth
            variant="outlined"
            size="small"
            type="text"
            value={username ?? ""}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Email */}
        <Grid item p={1}>
          <InputLabel required>Email Address</InputLabel>
          <TextField
            name="email"
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
            name="phone"
            disabled={!editAccount}
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
            name="address_line1"
            disabled={!editAccount}
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
            name="address_line2"
            disabled={!editAccount}
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
            name="address_line3"
            disabled={!editAccount}
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

        {/* Update Account Details Button */}
        <Grid item textAlign={"right"} m={0} p={2}>
          {!editAccount ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                disabled={!editAccount}
                color="success"
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ marginRight: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
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
              value={currentPassword ?? ""}
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
              value={newPassword ?? ""}
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
              value={confirmPassword ?? ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Change Password Errors  */}
          <Grid item>{error && <Alert severity="error">{error}</Alert>}</Grid>

          {/* Change Password Button */}
          <Grid item textAlign={"center"}>
            <Button
              variant="contained"
              size="small"
              onClick={handleChangePassword}
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
            onClick={handleOpenModal}
          >
            Delete Account
          </Button>
          <Typography variant="body2" color="error" align="center" mt={2}>
            Please be sure as we are not able to restore deleted accounts.
          </Typography>
        </Grid>
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
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
            onClick={handleCloseModal}
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
