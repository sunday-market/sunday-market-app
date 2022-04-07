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
import { useContext } from "react";

import DataContext from "../../context/DataContext";

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
  const { loggedInUser } = useContext(DataContext);

  const navigate = useNavigate();
  const UpdateCard = async (e) => {
    navigate(`/account/stalls/editstall/${cardId}`);
  };
  const CardDetails = async (e) => {
    navigate(`/stalls/viewstall/${cardId}`);
  };
  const PF = process.env.REACT_APP_PUBLIC_FOLDER + "stalls/";

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
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
              sx={{ fontWeight: "bold" }}
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
              {stallOwner === loggedInUser?._id ? (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      pl: 1,
                      pr: 1,
                      pt: 0.5,
                      pb: 0.5,
                      margin: 0.5,
                      borderRadius: 1,
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
                      borderRadius: 1,
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
                    borderRadius: 1,
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
