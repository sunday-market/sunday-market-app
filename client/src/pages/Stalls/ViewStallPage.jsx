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
  const [imageHeight, setImageHeight] = useState();
  const [date, setDate] = useState("");

  // need for getting params
  const params = useParams();
  const stallid = params.stallID;

  // error ref for scrolling
  const errorRef = useRef(null);

  // image ref for resizing
  const imgRef = useRef(null);

  // Handle image on load function
  const onImageLoad = ({ target: img }) => {
    setImageHeight(img.height);
  };

  // Handle image height function for dynamic resizing
  const getImageHeight = () => {
    if (imgRef) {
      const newHeight = imgRef.current.height;
      setImageHeight(newHeight);
    }
  };

  // Handle imageHeight when screen resizes
  useEffect(() => {
    window.addEventListener("resize", getImageHeight);
  }, []);

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
      const months = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      const dayDate = new Date(stall[0].createdAt).getDate();
      const monthDate = new Date(stall[0].createdAt).getMonth();
      const yearDate = new Date(stall[0].createdAt).getFullYear();
      setDate(`${dayDate}/${months[monthDate]}/${yearDate}`);
      const getUser = async (e) => {
        // Set header for Axios requests
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        try {
          const userID = stall[0].user;
          const userData = await axios.get(`/api/user/${userID}`, config);
          setUser(userData.data.data);
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid
          container
          display={"flex"}
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          {error && (
            <Grid item ref={errorRef} lg={12} md={12} sm={12} xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              align="center"
              color="textPrimary"
              variant="h5"
              sx={{
                display: "-webkit-box !important",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                pb: 2,
              }}
            >
              {stallLengthBool && stall[0].stallName
                ? stall[0].stallName.toUpperCase()
                : "No Stall Name Provided Provided"}
            </Typography>
          </Grid>
          <Grid item lg={5} md={4} sm={5} xs={11} zeroMinWidth>
            <Box
              ref={imgRef}
              component={"img"}
              width={"100%"}
              sx={{ borderRadius: 2 }}
              onLoad={onImageLoad}
              src={
                stallLengthBool && stall[0].image_url
                  ? stall[0].image_url
                  : "https://randomwordgenerator.com/img/picture-generator/53e4d2464252ae14f1dc8460962e33791c3ad6e04e507440722d72d59448c5_640.jpg"
              }
              alt={stallLengthBool ? stall[0].stallName : "Image for the store"}
            />
          </Grid>
          <Grid
            item
            container
            display="flex"
            justifyContent="start"
            lg={4}
            md={5}
            sm={7}
            xs={11}
            height={imageHeight}
            zeroMinWidth
          >
            <Typography
              align="center"
              color="textPrimary"
              variant="body2"
              sx={{
                display: "-webkit-box !important",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                pl: 2,
              }}
            >
              {stallLengthBool && stall[0].description
                ? stall[0].description
                : "No Description Provided For This Stall"}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={11} zeroMinWidth>
            <Box
              minHeight={imageHeight}
              maxHeight={"100%"}
              borderRadius={2}
              sx={{
                boxShadow: 3,
                pt: 1,
                pb: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {user && (
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="body2"
                  sx={{
                    display: "-webkit-box !important",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    pl: 2,
                    fontWeight: "bold",
                  }}
                >
                  Stall User:
                </Typography>
              )}
              {user && (
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="body2"
                  sx={{
                    display: "-webkit-box !important",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    pl: 2,
                  }}
                >
                  {user.username
                    ? user.username
                    : "No Username Can be found For This Stall"}
                </Typography>
              )}
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                  fontWeight: "bold",
                }}
              >
                Stall Active:
              </Typography>
              <Typography
                align="center"
                color={stallLengthBool && stall[0].activated ? "green" : "red"}
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                }}
              >
                {stallLengthBool && stall[0].activated
                  ? "Stall Is Currently Activate"
                  : "Stall Is Currently Deactivated"}
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                  fontWeight: "bold",
                }}
              >
                Stall Established Since:
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                }}
              >
                {stallLengthBool && stall[0].createdAt
                  ? date
                  : "This Stall Has No Creation Date"}
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                  fontWeight: "bold",
                }}
              >
                Contact Email:
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                }}
              >
                {stallLengthBool && stall[0].email
                  ? stall[0].email
                  : "No Contact Email has been Provided"}
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                  fontWeight: "bold",
                }}
              >
                Location:
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{
                  display: "-webkit-box !important",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  pl: 2,
                }}
              >
                {stallLengthBool && stall[0].city_location
                  ? stall[0].city_location
                  : "No Location has been Provided"}
              </Typography>
              <Box sx={{ pt: 0.5, marginBottom: 0.5 }} />
              <Box
                width={"100%"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    pl: 1,
                    pr: 1,
                    pt: 0.5,
                    pb: 0.5,
                    margin: "auto",
                    borderRadius: 1,
                    fontFamily: "Tahoma",
                  }}
                  onClick={"contactUs"}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
