import {
  Box,
  Grid,
  Button,
  Card,
  Typography,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jwt-decode";

export default function StallCard({
  cardId,
  stallOwner,
  cardTitle,
  imgTitle,
  imgSource,
  stallActive,
  cardCategory,
  cardDescription,
}) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const UpdateCard = async (e) => {
    navigate(`/account/stalls/editstall/${cardId}`);
  };
  const CardDetails = async (e) => {
    navigate(`/account/stalls/viewstall/${cardId}`);
  };
  const PF = process.env.REACT_APP_PUBLIC_FOLDER + "stalls/";
  // get current user
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getCurrentUserId = async () => {
      if (localStorage.getItem("authToken")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal,
        };
        try {
          const decodedJWT = jwt(localStorage.getItem("authToken"));
          const user = await axios.get(`/api/user/${decodedJWT.id}`, config);
          setCurrentUserId(user.data.data.id);
        } catch (error) {
          if (axios.isCancel(error)) {
            return console.log("Successfully Aborted");
          }
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            return navigate("/login");
          }
        }
      }
    };
    getCurrentUserId();
    return () => controller.abort();
  }, [navigate]);
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "solid 1px #eeeeee",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pb: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="body1"
              align="center"
              sx={{
                fontWeight: "bold",
              }}
            >
              {cardTitle ? cardTitle.toUpperCase() : "Card Title"}
            </Typography>
            <CardMedia
              component="img"
              height="175"
              alt={
                imgTitle
                  ? imgTitle
                  : "No alternative text has been provided for this image, we are very sorry for your inconvience"
              }
              image={imgSource ? PF + imgSource : PF + "noimage.png"}
            ></CardMedia>
            {stallActive ? (
              <Typography
                gutterBottom
                align="center"
                variant="body2"
                sx={{
                  mt: 1,
                  marginBottom: 0,
                  color: "green",
                  backgroundColor: "#eeeeee",
                }}
              >
                STALL ACTIVATED
              </Typography>
            ) : (
              <Typography
                gutterBottom
                align="center"
                variant="body2"
                sx={{
                  mt: 1,
                  marginBottom: 0,
                  color: "red",
                  backgroundColor: "#eeeeee",
                }}
              >
                STALL DEACTIVATED
              </Typography>
            )}
            <Typography
              gutterBottom
              align="center"
              variant="body2"
              sx={{ backgroundColor: "#eeeeee" }}
            >
              {cardCategory}
            </Typography>
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            variant="body2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box !important",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {cardDescription}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ pb: 2, pt: 2 }}>
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Grid
              item
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {stallOwner === currentUserId ? (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      pl: 1,
                      pr: 1,
                      pt: 0.5,
                      pb: 0.5,
                      margin: 0.5,
                      borderRadius: 2,
                      fontFamily: "Tahoma",
                    }}
                    onClick={CardDetails}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      pl: 1,
                      pr: 1,
                      pt: 0.5,
                      pb: 0.5,
                      margin: 0.5,
                      borderRadius: 2,
                      fontFamily: "Tahoma",
                    }}
                    onClick={UpdateCard}
                  >
                    Update
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    pl: 1,
                    pr: 1,
                    pt: 0.5,
                    pb: 0.5,
                    margin: 0.5,
                    borderRadius: 2,
                    fontFamily: "Tahoma",
                  }}
                  onClick={CardDetails}
                >
                  View Details
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}
