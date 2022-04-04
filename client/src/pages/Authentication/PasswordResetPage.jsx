import { useState, useEffect, useContext } from "react";
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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import ResetPasswordImage from "../../assets/resetpassword.svg";
import DataContext from "../../context/DataContext";

const PasswordResetPage = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenError, setTokenError] = useState(false);

  const { setLoading, setError, setSuccess } = useContext(DataContext);

  const navigate = useNavigate();
  const params = useParams();

  const resetToken = params.resetToken;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

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
        setLoading(false);
        if (axios.isCancel(error)) return;
        setTokenError(true);
      }
    })();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [resetToken, setError, setLoading]);

  const resetPasswordHandler = async () => {
    const controller = new AbortController();
    setLoading(true);

    if (!password) {
      return setError("You must enter a new password");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    };

    try {
      await axios.put(
        `/api/auth/resetpassword/${resetToken}`,
        {
          password,
        },
        config
      );
    } catch (error) {
      setLoading(false);
      if (axios.isCancel(error)) return;
      setError(error.response.data.error);
    }

    setLoading(false);
    setSuccess("Password Successfully Changed");
    navigate("/login");

    return () => {
      controller.abort();
    };
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
    </>
  );
};

export default PasswordResetPage;
