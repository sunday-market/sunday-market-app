import { useEffect, useState, useRef, useContext } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

import DataContext from "../../context/DataContext";

export default function MessagePage(props) {
  // States
  const [messageThreads, setMessageThread] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { state } = useLocation();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const { setError, setLoading, loggedInUser } = useContext(DataContext);

  // const variables
  const scrollRef = useRef();
  const navigate = useNavigate();
  const socket = useRef();

  // useEffects
  // SOCKET IO
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        send_user: data.senderId,
        message: data.sentMessage,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentMessage?.message_members.includes(arrivalMessage.send_user) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentMessage]);

  useEffect(() => {
    if (loggedInUser) {
      socket.current.emit("addUser", loggedInUser._id);
      socket.current.on("getUsers", (users) => {});
    }
  }, [loggedInUser]);

  // get messagethreads
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    const getMessageThreads = async () => {
      if (loggedInUser) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal,
        };
        try {
          const res = await axios.get(
            `/api/messagethreads/${loggedInUser._id}`,
            config
          );
          setMessageThread(res.data);
        } catch (error) {
          setLoading(false);
          if (axios.isCancel(error)) return;

          setError([error]);
        }
      }
    };
    getMessageThreads();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [navigate, currentMessage, setError, setLoading, loggedInUser]);

  useEffect(() => {
    setLoading(true);
    if (messageThreads.length > 0) {
      if (state && currentMessage === null) {
        messageThreads.forEach((m) => {
          if (m._id === state._id) {
            setCurrentMessage(m);
          }
        });
      }
    }
    setLoading(false);
  }, [currentMessage, messageThreads, setLoading, state]);

  // get messages
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getMesssages = async () => {
      if (currentMessage) {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            signal,
          };
          const res = await axios(
            `/api/messages/${currentMessage?._id}`,
            config
          );
          setMessages(res.data);
        } catch (error) {
          if (axios.isCancel(error)) {
            return console.log("Successfully Aborted");
          }
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            return navigate("/login");
          }
          setError("Unable to get messages for thread.");
        }
      }
    };

    getMesssages();
    return () => {
      controller.abort();
    };
  }, [currentMessage, navigate, setError, setLoading]);

  // scroll use effect
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const functions
  // handle submit of new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();

    const message = {
      send_user: loggedInUser._id,
      message: newMessage,
      message_thread_id: currentMessage._id,
    };

    // SOCKET IO instant message
    // get reciever from current chat message
    const recieverId = currentMessage.message_members.find(
      (member) => member !== loggedInUser._id
    );
    // emit new message to socket io
    socket.current.emit("sendMessage", {
      senderId: loggedInUser._id,
      recieverId,
      sentMessage: newMessage,
    });

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
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
    }

    return controller.abort();
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        <Grid container spacing={1} alignItems="center" justifyContent="center">
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
                <>
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
                        currentUser={loggedInUser._id}
                      />
                    </Box>
                  ))}
                </>

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
                            own={m.send_user === loggedInUser._id}
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
