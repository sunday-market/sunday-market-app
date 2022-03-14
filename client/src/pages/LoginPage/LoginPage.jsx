import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./loginPage.css";

import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  Paper,
} from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();

    // Set headers for Axios request
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        config
      );

      console.log(data);
      localStorage.setItem("authToken", data.token);

      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
      console.log(`ERROR: ${error.response.data}`);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <>
      <Box p={{ xs: 1, sm: 4, md: 10, lg: 20 }}>
        <Paper variant="outlined" align="center" sx={{ padding: "1em" }}>
          <Typography variant="h4">Login</Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            New to Sunday Markets? <Link to="/register">Sign up</Link>
          </Typography>

          <form onSubmit={loginHandler}>
            <Grid container direction="column" spacing={2} padding={2}>
              {/* Error Alert Message */}
              <Grid item>
                {error && <Alert severity="error">{error}</Alert>}
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
