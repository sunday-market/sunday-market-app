import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";

const AccountDeletedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
      <Paper variant="outlined" sx={{ padding: "2em" }}>
        <Typography variant="h4" mb={2}>
          Account Deleted
        </Typography>
        <Typography variant="body1" mb={2}>
          Your account has been deleted. Sorry to see you go!
        </Typography>
        <Typography variant="body1" mb={3}>
          If you would like to rejoin <b>Sunday Markets</b> you can easily{" "}
          <Link to="/register">Register</Link> again.
        </Typography>

        <Button variant="contained" onClick={() => navigate("/")}>
          Continue
        </Button>
      </Paper>
    </Box>
  );
};

export default AccountDeletedPage;
