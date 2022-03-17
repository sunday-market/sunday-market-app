import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Alert,
  TextField,
  InputLabel,
  Modal,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import ResetPasswordImage from "../../assets/resetpassword.svg";

const PasswordResetPage = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  const [resetToken, setResetToken] = useState(params.resetToken);

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

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    (async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const user = await axios.get(
          `/api/auth/resetpassword/${resetToken}`,
          config
        );

        setFullName(user.data.data.fullName);
      } catch (error) {
        setTokenError(error.response.data.error);
      }
    })();
  }, [resetToken]);

  const resetPasswordHandler = async () => {
    if (!password) {
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return setPasswordError("You must enter a new password");
    }

    if (password !== confirmPassword) {
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return setPasswordError("Passwords do not match!");
    }

    try {
      await axios.put(`/api/auth/resetpassword/${resetToken}`, {
        password,
      });
    } catch (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError(error.response.data.error);
    }

    handleOpenModal();

    setTimeout(() => {
      navigate("/login");
    }, 4000);
  };

  return (
    <>
      <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
        <Paper variant="outlined" sx={{ padding: "2em" }} align="center">
          <Box
            component="img"
            alt="Woman standing by computer with padlock in top right corner"
            src={ResetPasswordImage}
            sx={{ width: 200 }}
            mb={5}
          />
          <form>
            <Grid container direction="column" spacing={2} marginBottom={8}>
              <Grid item>
                <Typography variant="h5">Reset password</Typography>
              </Grid>

              <Grid item></Grid>

              {tokenError ? (
                <Grid item>
                  <Alert severity="error">
                    Sorry, we encountered a problem with the token. It may have
                    expired?
                  </Alert>
                  <Typography variant="body1" mt={1} mb={2}>
                    Please try the link again. If the problem persists you can
                    request another email to reset your password.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/forgotpassword"
                  >
                    Send Another Email
                  </Button>
                </Grid>
              ) : (
                <>
                  <Grid item>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography variant="body1">
                      <b>Hi {fullName},</b>
                    </Typography>
                    <Typography variant="body1">
                      Enter and confirm your new password below.
                    </Typography>
                  </Grid>

                  {/* New Password  */}
                  <Grid item>
                    <InputLabel>New Password</InputLabel>
                    <TextField
                      variant="outlined"
                      width={30}
                      size="small"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      sx={{ background: "white" }}
                    />
                  </Grid>

                  {/* Confirm Password  */}
                  <Grid item>
                    <InputLabel>Confirm your New Password</InputLabel>
                    <TextField
                      variant="outlined"
                      width={30}
                      size="small"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      sx={{ background: "white" }}
                    />
                  </Grid>
                  {/* Password Errors  */}
                  <Grid item>
                    {passwordError && (
                      <Alert severity="error">{passwordError}</Alert>
                    )}
                  </Grid>
                  <Grid item mt={2}>
                    <Button variant="contained" onClick={resetPasswordHandler}>
                      Change Password
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </Paper>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Password Updated
          </Typography>
          <Typography id="modal-modal-description" mt={2} mb={2}>
            Your password was successfully changed! <br />
            You will be automatically redirected to the Login screen.
          </Typography>
          <Button variant="contained" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PasswordResetPage;
