import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  InputLabel,
} from "@mui/material";

import registerImage from "../../assets/register.svg";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const registerHandler = async (e) => {
    e.preventDefault();

    // Set header for Axios requests
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        "/api/auth/register",
        {
          fullname: fullName,
          username,
          email,
          password,
        },
        config
      );

      // --------------------------------------------
      // Removed token to ensure that only a logged in user
      // can access the site pages.  Registered users
      // will not get a token until they login.
      // ---------------------------------------------
      // localStorage.setItem("authToken", data.token);

      navigate("/accountverify");
    } catch (error) {
      setError(error.response.data.error);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
      <Paper variant="outlined" align="center" sx={{ padding: "1em" }}>
        <Typography variant="h4">
          Create a Free Sunday Market Account
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography>

        <Grid container direction="row" alignItems="center">
          {/* Register Form */}
          <Grid item xs={12} md={6} sx={{ background: "#eceff1" }}>
            <form onSubmit={registerHandler}>
              <Grid container direction="column" spacing={2} padding="1em">
                {/* Error Alert Message */}
                <Grid item>
                  {error && <Alert severity="error">{error}</Alert>}
                </Grid>

                {/* Full Name */}
                <Grid item align={"left"}>
                  <InputLabel required>Full Name</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Username */}
                <Grid item align={"left"}>
                  <InputLabel required>Username</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    value={username.toLowerCase()}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Email */}
                <Grid item align={"left"}>
                  <InputLabel required>Email Address</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="email"
                    value={email.toLowerCase()}
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
                    placeholder="Create a Password"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Submit Button  */}
                <Grid item>
                  <Box padding={3}>
                    <Button size="large" variant="contained" type="submit">
                      Create Account
                    </Button>
                  </Box>
                </Grid>

                <Typography variant="body2" sx={{ mb: 4 }}>
                  By signing up, you agree to the{" "}
                  <Link to="/login">Terms and Conditions</Link>
                </Typography>
              </Grid>
            </form>
          </Grid>

          {/* Register Image */}
          <Grid
            item
            xs={0}
            sm={0}
            md={6}
            display={{ xs: "none", md: "block" }}
            alignItems="center"
          >
            <img height="150px" src={registerImage} alt="Login" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RegisterPage;