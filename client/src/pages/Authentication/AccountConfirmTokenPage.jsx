import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Paper, Button, Typography } from "@mui/material";

import AccountVerifiedImage from "../../assets/accountverified.svg";
import ErrorImage from "../../assets/error.svg";

const AccountConfirmTokenPage = () => {
  const [verified, setVerified] = useState(false);
  const [fullName, setFullName] = useState("John");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const confirmToken = async () => {
      try {
        const verificationToken = params.verificationToken;

        const user = await axios.put(`/api/auth/verify/${verificationToken}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setFullName(user.data.data.fullName);
        setVerified(true);
      } catch (error) {
        setVerified(false);
      }
    };
    confirmToken();
  }, [params]);

  return (
    <Box px={{ xs: 1, sm: 4, md: 8, lg: 20 }} py={4}>
      <Paper variant="outlined" sx={{ padding: "2em" }} align="center">
        {verified ? (
          <>
            <Typography variant="h5" mb={2}>
              Account Activated
            </Typography>

            <Box
              component="img"
              src={AccountVerifiedImage}
              alt="Email with tick"
              sx={{
                width: "100px",
              }}
            />

            <Typography variant="body1" mt={2}>
              <b>Hello {fullName}, </b>
            </Typography>

            <Typography variant="body1" mb={2} mt={2}>
              Thank you, your email has been verified. Your account is now
              active. <br />
              Please use the button below to login to your account.
            </Typography>

            <Button variant="contained" onClick={() => navigate("/login")}>
              Login to your account
            </Button>

            <Typography variant="body1" mt={2}>
              Thank you for choosing Sunday Markets
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" mb={2}>
              Something Went Wrong
            </Typography>

            <Box
              component="img"
              src={ErrorImage}
              alt="Error image with warning sign and construction worker"
              sx={{
                width: "150px",
              }}
            />

            <Typography variant="body1" mb={2} mt={2}>
              We're sorry, but this request has expired or is invalid. Please
              try again.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AccountConfirmTokenPage;
