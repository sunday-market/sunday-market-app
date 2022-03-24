import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Message from "../../components/Messages/Message";
import MessageThread from "../../components/Messages/MessageThread";
import jwt from "jwt-decode";
import {
  Alert,
  Grid,
  Box,
  Typography,
  TextareaAutosize,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MessagePage() {
  // States
  const [messageThreads, setMessageThread] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  // const variables
  const scrollRef = useRef();
  const navigate = useNavigate();
  const errorRef = useRef(null);

  // useEffects
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
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            return navigate("/login");
          }
          setError("Login has expired");
          setTimeout(() => {
            setError("");
          }, 15000);
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };
    getCurrentUser();
  }, [navigate]);

  // get messagethreads
  useEffect(() => {
    const getMessageThreads = async () => {
      if (currentUser) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        try {
          const res = await axios.get(
            `/api/messagethreads/${currentUser.id}`,
            config
          );
          setMessageThread(res.data);
        } catch (error) {
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            return navigate("/login");
          }
          setError("Unable to load message threads.");
          setTimeout(() => {
            setError("");
          }, 15000);
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };
    getMessageThreads();
  }, [currentUser, navigate]);

  // get messages
  useEffect(() => {
    const getMesssages = async () => {
      if (currentMessage) {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          };
          const res = await axios(
            `/api/messages/${currentMessage?._id}`,
            config
          );
          setMessages(res.data);
        } catch (error) {
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            return navigate("/login");
          }
          setError("Unable to get messages for thread.");
          setTimeout(() => {
            setError("");
          }, 15000);
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    getMesssages();
  }, [currentMessage, navigate]);

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
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const res = await axios.post("/api/messages/", message, config);
      setMessages([...messages, res.data]);
      setNewMessage("");
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
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          {/* ERROR */}
          {error && (
            <Grid item ref={errorRef} lg={12} md={12} sm={12} xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {/* THREAD BOX */}
          <Grid item lg={3} md={3} sm={3} xs={12} height="500px">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                bgcolor: "#fafafa",
              }}
              boxShadow={3}
              height="100%"
              borderRadius={1}
              pl={2}
              pr={2}
            >
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
                Message Threads
              </Typography>
              <Box
                height="100%"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflowY: "scroll",
                  mb: 2,
                }}
              >
                {messageThreads?.map((m) => (
                  <Box
                    pl={2}
                    pr={2}
                    m={1}
                    borderRadius={1}
                    bgcolor={
                      currentMessage !== null && m._id === currentMessage._id
                        ? "lightBlue"
                        : "#cfd8dc"
                    }
                    onClick={() => setCurrentMessage(m)}
                    key={m._id}
                    sx={{ cursor: "pointer" }}
                  >
                    <MessageThread
                      messageThread={m}
                      currentUser={currentUser.id}
                    />
                  </Box>
                ))}
                <Box height="100%" />
              </Box>
            </Box>
          </Grid>
          {/* CHATBOX */}
          <Grid item lg={9} md={9} sm={9} xs={12} maxHeight="500px">
            {/* CHATBOX WRAPPER */}
            <Box
              height="100%"
              sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fafafa",
              }}
              boxShadow={5}
              borderRadius={1}
              pl={2}
              pr={2}
            >
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
                  <Box
                    height="100%"
                    maxHeight="375px"
                    sx={{ overflowY: "scroll" }}
                  >
                    {messages.length !== 0 ? (
                      messages.map((m) => (
                        <Box margin={"auto"} ref={scrollRef} key={m._id}>
                          <Message
                            message={m}
                            own={m.send_user === currentUser.id}
                          />
                        </Box>
                      ))
                    ) : (
                      <Box height="100%" maxHeight="375px">
                        <Typography
                          sx={{ textAlign: "center", verticalAlign: "end" }}
                        >
                          No messages, send them a new message!
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {/* CHATBOX BOTTOM */}
                  <Box
                    height="100%"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 1,
                    }}
                  >
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Send a new message..."
                      style={{ margin: 1, width: "80%" }}
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    />
                    <Button
                      variant="contained"
                      sx={{ margin: 1, width: "15%" }}
                      onClick={handleSubmit}
                    >
                      Send
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box height="444px">
                    <Typography
                      align="center"
                      color="textPrimary"
                      variant="body2"
                      sx={{
                        display: "-webkit-box !important",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        pb: 2,
                      }}
                    >
                      Open a message thread to view message..
                    </Typography>
                    <Box height="100%" />
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
