import { useRef, useEffect, useState } from "react";
import {
  Grid,
  Box,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Alert,
  Button,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import jwt from "jwt-decode";
import { useParams } from "react-router-dom";

export default function ViewStallPage() {
  const [stall, setStall] = useState([]);
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");

  // need for getting params
  const params = useParams();
  const stallid = params.stallID;

  // error ref for scrolling
  const errorRef = useRef(null);

  // Get stall info
  useEffect(() => {
    if (stallid) {
      const getStall = async () => {
        try {
          const stallData = await axios.get(`/api/stalls/${stallid}`);
          console.log(stallData);
          setStall(stallData.data);
        } catch (err) {
          console.log("error");
          setError("No Stall Exists with that ID");
          setTimeout(() => {
            setError("");
          }, 15000);
        }
      };
      getStall();
    }
  }, [stallid]);

  // Get stall user from stall info
  useEffect(() => {
    if (stall.length !== 0) {
      const getUser = async (e) => {
        // Set header for Axios requests
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        try {
          const userID = stall[0].user;
          setUser(await axios.get(`api/user/${userID.id}`, config));
        } catch (err) {
          setError(
            "User of this Stall can't be found can be found, please contact management"
          );
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };
      getUser();
    }
  }, [stall, user]);

  const stallLengthBool = stall.length > 0;
  return (
    <>
      <Typography
        align="center"
        color="textPrimary"
        variant="h3"
        sx={{
          display: "-webkit-box !important",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          pb: 2,
        }}
      >
        {stallLengthBool
          ? stall[0].stallName.toUpperCase()
          : "No Stall Name Provided Provided"}
      </Typography>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          {error && (
            <Grid item ref={errorRef} lg={12} md={12} sm={12} xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item lg={5} md={4} sm={5} xs={11} zeroMinWidth>
            <Box
              component={"img"}
              width={"100%"}
              sx={{ borderRadius: 2 }}
              src={
                stallLengthBool
                  ? stall[0].image_url
                  : "https://randomwordgenerator.com/img/picture-generator/53e4d2464252ae14f1dc8460962e33791c3ad6e04e507440722d72d59448c5_640.jpg"
              }
              alt={stallLengthBool ? stall[0].stallName : "Image for the store"}
            />
            <Box bgcolor={"yellow"} width={"100%"} height={"100px"}></Box>
          </Grid>
          <Grid item lg={4} md={5} sm={7} xs={11} zeroMinWidth>
            <Typography
              align="center"
              color="textPrimary"
              variant="body2"
              sx={{
                display: "-webkit-box !important",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {stallLengthBool
                ? stall[0].description
                : "No Description Provided"}
            </Typography>
            <Box bgcolor={"yellow"} width={"100%"} height={"100px"}></Box>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={11} zeroMinWidth>
            <Box bgcolor={"yellow"} width={"100%"} height={"100px"}></Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
