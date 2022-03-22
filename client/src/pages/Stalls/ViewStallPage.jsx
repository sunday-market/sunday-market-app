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
    const newHeight = imgRef.current.height;
    console.log(newHeight);
    setImageHeight(newHeight);
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
      <div>{imageHeight}</div>
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
              width={"100%"}
              height={imageHeight}
              sx={{ boxShadow: 3 }}
            ></Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
