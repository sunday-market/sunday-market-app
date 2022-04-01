import axios from "axios";
import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

import ContactSupportIcon from "@mui/icons-material/ContactSupport";

import SupportImage from "../assets/support.svg";
import ContactSupportImage from "../assets/contactsupport.jpg";
import QuestionsImage from "../assets/questions.svg";

import {
  Alert,
  Box,
  CardMedia,
  Typography,
  Grid,
  Button,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import PageLoading from "../components/PageLoading";

const Support = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [user, setUser] = useState();
  // Get User information if they are logged in and populate data

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    (async () => {
      if (localStorage.getItem("authToken")) {
        const jwtToken = localStorage.getItem("authToken");
        const decodedJWT = jwtDecode(jwtToken);

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal: controller.signal,
        };

        await axios
          .get(`/api/user/${decodedJWT.id}`, config)
          .then((result) => {
            setUser(result.data);
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
          });
      }
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            direction="row"
          >
            <CardMedia
              component="img"
              src={ContactSupportImage}
              height="200px"
              style={{
                filter: "grayscale(50%) contrast(50%) blur(1px)",
                position: "relative",
              }}
            />

            <Box position="absolute" align="center">
              <Typography
                variant="h3"
                textAlign="center"
                color="white"
                sx={{
                  textShadow: "0px 0px 15px black",
                  WebkittextStroke: "2px red",
                }}
              >
                Sunday Market Support
              </Typography>

              <Typography
                backgroundColor="rgba(0, 0, 0, 0.10)"
                variant="h5"
                textAlign="center"
                color="white"
                p={1}
                sx={{
                  textShadow: "0px 0px 2px black",
                }}
              >
                Got an issue? Let us know!
              </Typography>
            </Box>
          </Box>

          <Grid
            container
            justifyContent="center"
            position="relative"
            dirction="column"
            mt={2}
            height="100%"
          >
            <Grid item xs={11} sm={6} md={5} p={1}>
              <Box
                backgroundColor="#f0f0f0"
                border="solid 1px #b0b0b0"
                p={2}
                borderRadius={1}
              >

                  <Grid container direction="column">
                    <Grid container alignItems="center">
                      <ContactSupportIcon
                        style={{ fontSize: 40, color: "grey" }}
                        display="inline-block"
                      />
                      <Typography variant="h5">
                        <strong>Contact Support</strong>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography ml={5} variant="body1">
                      Got an issue? Want to provide feedback? Fill out the form  below to send us a message.  
                      </Typography>
                    </Grid>

                    <Grid item p={1}>
                      <InputLabel>Name: </InputLabel>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        size="small"
                        sx={{ backgroundColor: "white" }}
                      />
                    </Grid>

                    <Grid item p={1}>
                      <InputLabel>Email:</InputLabel>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        size="small"
                        sx={{ backgroundColor: "white" }}
                      />
                    </Grid>

                    <Grid item p={1}>
                      <InputLabel>Contact Reason:</InputLabel>
                      <Select
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: "white" }}
                      >
                        <MenuItem value="report stall">Report a Stall</MenuItem>
                        <MenuItem value="order problem">
                          Problem with an Order
                        </MenuItem>
                        <MenuItem value="feedback">Give Feedback</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item p={1}>
                      <InputLabel>Comments:</InputLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        type="text"
                        size="small"
                        sx={{ backgroundColor: "white" }}
                      />
                    </Grid>

                    <Grid item p={1}>
                      <Box textAlign="center">
                        <Button variant="contained">Send Message</Button>
                      </Box>
                    </Grid>
                  </Grid>

              </Box>
            </Grid>

            <Grid
              container
              xs={11}
              sm={6}
              md={5}
              p={1}
              sx={{}}
            >
              <Box
                backgroundColor="#d0d0d0"
                border="solid 1px #b0b0b0"
                p={2}
                borderRadius={1}
                display="flex"
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                // height="100%"
              >
                <Box
                  component="img"
                  src={QuestionsImage}
                  alt="One-eyed creatures with computer and question marks"
                  width="70%"
                />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Support;
