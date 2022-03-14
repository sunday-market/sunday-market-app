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

      console.log(data.token);
      localStorage.setItem("authToken", data.token);

      navigate("/registerconfirmation");
    } catch (error) {

      setError(error.response.data.error);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Box p={{ xs: 1, sm: 4, md: 8, lg: 20 }}>
      <Paper variant="outlined" align="center" sx={{ padding: "1em" }}>
        <Typography variant="h4">
          Create a Free Sunday Market Account
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography>

        <Grid container direction="row" alignItems="center">
          {/* Register Form */}
          <Grid item xs={12} sm={6} sx={{ background: "#eceff1" }}>
            <form onSubmit={registerHandler}>
              <Grid container direction="column" spacing={2} padding="1em">
                {/* Error Alert Message */}
                <Grid item>
                  {error && <Alert severity="error">{error}</Alert>}
                </Grid>

                {/* Full Name */}
                <Grid item>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Full Name"
                    size="small"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Username */}
                <Grid item>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Username"
                    size="small"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Email */}
                <Grid item>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Email"
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
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Password"
                    size="small"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    sx={{ background: "white" }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Confirm Password"
                    size="small"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
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
            sm={6}
            display={{ xs: "none", sm: "block" }}
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
