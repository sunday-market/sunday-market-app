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
  TextareaAutosize,
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
  const [messageThreads, setMessageThread] = useState([]);
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
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessageThreads();
  }, [currentUser]);

  // get messages
  useEffect(() => {
    const getMesssages = async () => {
      try {
        const res = await axios(`/api/messages/${currentMessage?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMesssages();
  }, [currentMessage]);

  // scroll use effect
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const functions
  // handle submit of new message
  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      send_user: currentUser.id,
      message: newMessage,
      message_thread_id: messageThreads[0]._id,
    };
    console.log(message);
    try {
      const res = await axios.post("/api/messages/", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Typography>Current username: {currentUser?.username}</Typography>
      <Typography>Current user id: {currentUser?.id}</Typography>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        <Grid
          container
          display={"flex"}
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          {/* THREAD BOX */}
          <Grid item lg={3} md={3} sm={3} xs={3}>
            <Typography
              align="center"
              color="textPrimary"
              variant="h6"
              sx={{
                pb: 2,
              }}
            >
              MESSAGE THREADS
            </Typography>
            {messageThreads?.map((m) => (
              <Box bgcolor={"red"} onClick={() => setCurrentMessage(m)}>
                <MessageThread messageThread={m} currentUser={currentUser.id} />
              </Box>
            ))}
          </Grid>
          {/* CHATBOX */}
          <Grid item lg={9} md={9} sm={9} xs={9}>
            {/* CHATBOX WRAPPER */}
            <Box>
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
              {currentMessage ? (
                <>
                  {/* CHATBOX TOP */}
                  <Box>
                    {messages.map((m) => (
                      <Box margin={"auto"} ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.send_user === currentUser.id}
                        />
                      </Box>
                    ))}
                  </Box>
                  {/* CHATBOX BOTTOM */}
                  <Box>
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Send a new message..."
                      style={{ width: 200 }}
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    />
                    <Button variant="contained" onClick={handleSubmit}>
                      Send
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box component="span">
                    Open a message thread to view message..
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
