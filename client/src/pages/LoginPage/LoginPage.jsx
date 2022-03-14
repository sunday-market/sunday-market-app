import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./loginPage.css";

import { Typography, Box, Button, TextField, Grid, Alert } from "@mui/material";

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

  const loginHandler = async () => {
    console.log("Called the loginHandler...");
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
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      bgcolor="#f5f5f5"
      textAlign="center"
      padding={5}
      sx={{ borderRadius: "16px" }}
    >
      <Typography variant="h4">Login</Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        New to Sunday Markets?{" "}
        <Link to="/register">Sign up for the first time</Link>
      </Typography>

      <Grid container direction={"column"} spacing={2}>
        <Grid item>{error && <Alert severity="error">{error}</Alert>}</Grid>

        <Grid item>
          <TextField
            variant="outlined"
            label="Email"
            size="small"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            sx={{ width: "30ch" }}/>
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label="Password"
            size="small"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            sx={{ width: "30ch" }}/>

        </Grid>
      </Grid>

      <Typography variant="body2">
        <Link to="/forgotpassword">Forgot password?</Link>
      </Typography>

      <Box textAlign="center" padding={5}>
        <Button
          size="large"
          onClick={loginHandler}
          variant="contained"
          textAlign="center"
        >
          Login
        </Button>
      </Box>
    </Grid>
  );
};

export default LoginPage;
