import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

const useSendMessage = (receiverId, room) => {
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [messageThread, setMessageThread] = useState({});

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const controller = useMemo(() => new AbortController(), []);

  // Get the Current User Id and Set as the Sender
  useEffect(() => {
    const decodedJWT = jwtDecode(localStorage.getItem("authToken"));
    setSender(decodedJWT.id);
  }, []);

  // Return Error
  useEffect(() => {
    controller.abort();
    return error;
  }, [error, controller]);

  // Confirm that the Receiver exists
  if (!receiverId) {
    setError("Reciever id not supplied");
  }

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };

    (async () => {
      await axios
        .get(`/api/user/exists/${receiverId}`, config)
        .then((exists) => {
          if (exists) {
            setReceiver(receiverId);
          } else {
            setError("Receiver does not exist");
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    })();
  }, [receiverId, controller.signal]);
};

export default useSendMessage;
