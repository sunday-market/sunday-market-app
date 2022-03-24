import { useRef, useEffect, useState } from "react";
import { Grid, Box, Typography, Alert, Button } from "@mui/material";
import axios from "axios";
import { useNavigate, Redirect } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import { useParams } from "react-router-dom";
import BuildIcon from "@mui/icons-material/Build";
import jwt from "jwt-decode";

export default function ViewStallPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [stall, setStall] = useState([]);
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [imageHeight, setImageHeight] = useState();
  const [date, setDate] = useState("");
  const [isOwnStall, setIsOwnStall] = useState(false);

  // need for getting params
  const params = useParams();
  const navigate = useNavigate();
  const stallid = params.stallID;

  // handle update button click
  const update = () => {
    console.log("update clicked");
  };

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
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          };
          const stallData = await axios.get(`/api/stalls/${stallid}`, config);
          setStall(stallData.data);
        } catch (err) {
          setError("No Stall Exists with that ID");
          setTimeout(() => {
            setError("");
          }, 15000);
        }
      };
      getStall();
    }
  }, [stallid]);

  // get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      if (localStorage.getItem("authToken")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        try {
          const decodedJWT = await jwt(localStorage.getItem("authToken"));
          const user = await axios.get(`/api/user/${decodedJWT.id}`, config);
          setCurrentUser(user.data.data);
        } catch (error) {
          console.log(error);
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            return navigate("/login");
          }
        }
      }
    };
    getCurrentUser();
  }, [navigate]);

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
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
  useEffect(() => {
    const checkIfOwner = () => {
      if (user && currentUser) {
        setIsOwnStall(currentUser.id === user.id);
      }
    };
    checkIfOwner();
  }, [user, currentUser]);

  // new message
  const handleNewMessage = async (e) => {
    e.preventDefault();
    console.log(`this is the user: ${user}`);
    console.log(`this is the current user: ${currentUser}`);
    if (user && currentUser) {
      const messageThread = {
        stall_name: stall[0].stallName,
        send_user: currentUser.id,
        recieve_user: user.id,
      };
      console.log(messageThread);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        // check for messages already existing
        let mesCheck = await axios.get(
          `/api/messagethreads/${currentUser.id}`,
          config
        );
        mesCheck = mesCheck.data;
        let stateCheck = null;
        mesCheck.forEach((mt) => {
          if (messageThread.stall_name === mt.stall_name) {
            if (
              (messageThread.send_user === mt.message_members[0] &&
                messageThread.recieve_user === mt.message_members[1]) ||
              (messageThread.send_user === mt.message_members[1] &&
                messageThread.recieve_user === mt.message_members[0])
            ) {
              console.log("true");
              return (stateCheck = mt);
            }
          }
        });
        if (stateCheck) {
          navigate("/account/messages", { state: stateCheck });
        } else {
          console.log("pass return wtf");
          const res = await axios.post(
            "/api/messagethreads/",
            messageThread,
            config
          );
          return navigate("/account/messages", { state: res.data });
        }
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          return navigate("/login");
        }
        setError("Unable to send new message.");
        setTimeout(() => {
          setError("");
        }, 15000);
        errorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      setError(
        "You are either not logged in or this stall has no user assigned to it, please contact management."
      );
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const stallLengthBool = stall.length > 0;
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid container spacing={1} justifyContent="center">
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
                {isOwnStall ? (
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
                    onClick={update}
                  >
                    <BuildIcon />
                    &nbsp;Update
                  </Button>
                ) : (
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
                    onClick={handleNewMessage}
                  >
                    <MailIcon />
                    &nbsp;Instant Message
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
