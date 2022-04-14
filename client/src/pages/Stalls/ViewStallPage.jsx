import { useRef, useEffect, useState, useContext } from "react";
import { Grid, Box, Typography, Alert, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import BuildIcon from "@mui/icons-material/Build";
import jwt from "jwt-decode";
import SendMessageButton from "../../components/SendMessageButton";
import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";

export default function ViewStallPage() {
  const [stall, setStall] = useState([]);
  const [user, setUser] = useState([]);
  const [date, setDate] = useState("");
  const [isOwnStall, setIsOwnStall] = useState(false);
  const { setError, setLoading, loggedInUser } = useContext(DataContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER + "stalls/";

  // need for getting params
  const params = useParams();
  const navigate = useNavigate();
  const stallid = params.stallID;

  // handle update button click
  const update = () => {
    navigate(`/account/stalls/editstall/${stallid}`);
  };

  // image ref for resizing
  const imgRef = useRef(null);

  // Get stall info
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true);
    if (stallid) {
      const getStall = async () => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            signal: signal,
          };
          const stallData = await axios.get(`/api/stalls/${stallid}`, config);
          setStall(stallData.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          if (axios.isCancel(error)) {
            return;
          }
          setError([error]);
        }
      };
      getStall();
    }
    setLoading(false);
    return () => controller.abort();
  }, [setError, setLoading, stallid]);

  // Get stall user from stall info
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isApiSubscribed = true;
    setLoading(true);
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
        if (localStorage.getItem("authToken")) {
          // Set header for Axios requests
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            signal,
          };
          try {
            const userID = stall[0].user;
            const userData = await axios.get(`/api/user/${userID}`, config);

            if (isApiSubscribed) {
              setUser(userData.data.data);
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            if (axios.isCancel(error)) {
              return;
            }
            setError(
              "User of this Stall can't be found can be found, please contact management"
            );
          }
        }
      };

      getUser();
    }
    setLoading(false);
    return () => {
      controller.abort();
      isApiSubscribed = false;
    };
  }, [setError, setLoading, stall]);

  useEffect(() => {
    const checkIfOwner = () => {
      if (user && loggedInUser) {
        setIsOwnStall(loggedInUser._id === user.id);
      }
    };
    checkIfOwner();
  }, [loggedInUser, user]);

  const stallLengthBool = stall.length > 0;
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        <Grid container spacing={0} justifyContent="center">
          <Grid
            justifyContent="center"
            alignItems={"center"}
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Typography
              align="center"
              color="textPrimary"
              variant="h5"
              sx={{
                pb: 2,
              }}
            >
              {stallLengthBool && stall[0].stallName
                ? stall[0].stallName.toUpperCase()
                : "No Stall Name Provided Provided"}
            </Typography>
          </Grid>
          <Grid item lg={5} md={4} sm={5} xs={11}>
            <Box
              ref={imgRef}
              component={"img"}
              width={"100%"}
              sx={{ borderRadius: 2 }}
              src={
                stallLengthBool && PF + stall[0].image_url
                  ? PF + stall[0].image_url
                  : PF + "noimage.png"
              }
              alt={stallLengthBool ? stall[0].stallName : "Image for the store"}
            />
          </Grid>
          <Grid
            item
            container
            display="flex"
            px={3}
            py={2}
            justifyContent="start"
            lg={4}
            md={5}
            sm={7}
            xs={11}
            maxHeight={"100%"}
          >
            <Typography align="center" color="textPrimary" variant="body2">
              {stallLengthBool && stall[0].description
                ? stall[0].description
                : "No Description Provided For This Stall"}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={11}>
            <Box
              maxHeight={"100%"}
              borderRadius={2}
              sx={{
                boxShadow: 3,
                pt: 2,
                pb: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {user.length > 0 && (
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Stall User:
                </Typography>
              )}
              {user.length > 0 && (
                <Typography align="center" color="textPrimary" variant="body2">
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
                  fontWeight: "bold",
                }}
              >
                Stall Active:
              </Typography>
              <Typography
                align="center"
                color={stallLengthBool && stall[0].activated ? "green" : "red"}
                variant="body2"
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
                  fontWeight: "bold",
                }}
              >
                Stall Established Since:
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{}}
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
                  fontWeight: "bold",
                }}
              >
                Contact Email:
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body2"
                sx={{}}
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
                  fontWeight: "bold",
                }}
              >
                Location:
              </Typography>
              <Typography align="center" color="textPrimary" variant="body2">
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
                  <SendMessageButton stall={stall[0]} />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
