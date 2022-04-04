import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

import DataContext from "../../context/DataContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedError, setVerifiedError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [verificationError, setVerificationError] = useState("");

  const { setError, setLoading } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const resendVerification = async () => {
    const controller = new AbortController();

    if (!email) {
      setTimeout(() => {
        setVerificationError("");
      }, 5000);
      return setVerificationError("Please provide an email address");
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      };

      await axios.post(
        "/api/auth/resetverificationtoken",
        {
          email,
        },
        config
      );

      setVerifiedError(false);
      setVerificationSuccess(
        "Verification email sent.  Please check your email."
      );
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError([error]);
    }
    return controller.abort();
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    setLoading(true);

    // Set headers for Axios request
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        config
      );

      localStorage.setItem("authToken", data.token);
      controller.abort();
      setLoading(false);
      navigate("/");
    } catch (error) {
      if (axios.isCancel(error)) return;
      setLoading(false);
      setError([error]);
    }

    setLoading(false);
    return controller.abort();
  };

  return (
    <>
      <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
        <Paper variant="outlined" align="center" sx={{ padding: "1em" }}>
          <Typography variant="h4">Login</Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            New to Sunday Markets? <Link to="/register">Sign up</Link>
          </Typography>

          <form onSubmit={loginHandler}>
            <Grid container direction="column" spacing={2} padding={2}>
              <Grid item>
                {/* Verification Success Alert Message */}
                {verificationSuccess && (
                  <Alert severity="success">{verificationSuccess}</Alert>
                )}

                {/* Display Alert Message if user has not validated  */}
                {verifiedError && (
                  <Alert severity="warning" align>
                    <Typography variant="body2" mb={2}>
                      You have not verified your email address. Please check
                      your email for the verification link. If you did not get
                      an email check your spam/junk folder.
                    </Typography>

                    <Button variant="contained" onClick={resendVerification}>
                      Resend Verification
                    </Button>
                  </Alert>
                )}

                {verificationError && (
                  <Alert severity="error">{verificationError}</Alert>
                )}
              </Grid>

              {/* Email */}
              <Grid item align={"left"}>
                <InputLabel required>Email</InputLabel>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@domain.com"
                  sx={{ background: "white" }}
                />
              </Grid>

              {/* Password */}
              <Grid item align={"left"}>
                <InputLabel required>Password</InputLabel>
                <TextField
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

              <Grid item>
                <Button type="submit" size="large" variant="contained">
                  Login
                </Button>
              </Grid>

              <Grid item>
                <Typography variant="body2">
                  <Link to="/forgotpassword">Forgot password?</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default LoginPage;
