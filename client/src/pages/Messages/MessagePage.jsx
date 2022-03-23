import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Message from "../../components/Messages/Message";
import MessageThread from "../../components/Messages/MessageThread";
import jwt from "jwt-decode";
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

export default function MessagePage() {
  // States
  const [messageTheads, setMessageThread] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // const variables
  const scrollRef = useRef();

  // useEffects
  // get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      if (localStorage.getItem("authToken")) {
        try {
          const decodedJWT = await jwt(localStorage.getItem("authToken"));
          const user = await axios.get(`/api/user/${decodedJWT.id}`);
          setCurrentUser(user.data.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getCurrentUser();
  }, []);

  // get messagethreads
  useEffect(() => {
    const getMessageThreads = async () => {
      if (currentUser) {
        try {
          const res = await axios.get(`/api/messagethreads/${currentUser.id}`);
          setMessageThread(res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessageThreads();
  }, [currentUser]);
  return (
    <>
      <Typography>Current username: {currentUser?.username}</Typography>
      <Typography>Current user id: {currentUser?.id}</Typography>
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
          <Grid item lg={3} md={3} sm={3} xs={2}>
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
              MESSAGE THREADS
            </Typography>
            {messageTheads?.map((m) => (
              <Box bgcolor={"red"}>
                <MessageThread messageThread={m} currentUser={currentUser.id} />
              </Box>
            ))}
          </Grid>
          <Grid item lg={9} md={9} sm={9} xs={10}>
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
              Conversations
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
