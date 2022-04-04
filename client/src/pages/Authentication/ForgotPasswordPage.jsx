import { useState, useContext } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";

import DataContext from "../../context/DataContext";
import ForgotPasswordImage from "../../assets/forgotpassword.svg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { setError, setSuccess } = useContext(DataContext);

  const forgotPasswordHandler = async () => {
    const controller = new AbortController();

    setError("");
    setSuccess("");
    if (!email) {
      return setError("Email address must be provided");
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      };

      await axios.post("/api/auth/forgotpassword", { email }, config);

      setSuccess(`Password reset instructions have been sent to ${email}.`);
    } catch (error) {
      if (axios.isCancel(error)) return;
      setError(error.response.data.error);
    }
    return controller.abort();
  };

  return (
    <>
      <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
        <Paper variant="outlined" sx={{ padding: "2em" }} align="center">
          <Box
            component="img"
            alt="Person looking at password screen with question mark above head"
            src={ForgotPasswordImage}
            mb={5}
            mt={5}
            sx={{
              width: "200px",
            }}
          />
          <Typography variant="h5" mb={2}>
            Forgot your Password?
          </Typography>
          <Typography variant="body1" mb={2}>
            Don't worry! Enter your email below and we'll email you with
            instructions on how to reset your password.
          </Typography>

          <form>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <TextField
                  variant="outlined"
                  size="small"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  sx={{ background: "white", width: "30ch" }}
                />
              </Grid>

              <Grid item>
                <Button variant="contained" onClick={forgotPasswordHandler}>
                  Send Email
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
