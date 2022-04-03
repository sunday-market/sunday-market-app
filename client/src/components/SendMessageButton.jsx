import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import jwtDecode from "jwt-decode";
import axios from "axios";

import { Button } from "@mui/material";

const SendMessageButton = (props) => {
  const { children, variant, user, stall } = props;
  const [currentUser, setCurrentUser] = useState(undefined);

  const navigate = useNavigate();

  // Set Current User
  useEffect(() => {
    const controller = new AbortController();

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const decodedJWT = jwtDecode(authToken);
      setCurrentUser(decodedJWT.id);
    }
    return () => {
      controller.abort();
    };
  }, [currentUser]);

  const handleOnClick = async (e) => {
    e.preventDefault();
    const controller = new AbortController();

    let messageThread = {
      stall_name: undefined,
      send_user: currentUser,
      recieve_user: undefined, // Spelling mistake intentional
    };

    // Check that a Stall or User has been supplied
    if (!(stall || user)) {
      console.error(
        'SendMessageButton Component requires a "Stall" or "User" prop.'
      );
      return new Error("Stall or User not supplied");
    }

    // Logged out users send message through their email client
    if (!currentUser) {
      if (stall) {
        return (window.location.href = `mailto:${stall.email}`);
      } else {
        return (window.location.href = `mailto:${user.email}`);
      }
    }

    // setup message thread for a stall
    if (stall) {
      messageThread = {
        ...messageThread,
        ...{ stall_name: stall.stallName, recieve_user: stall.user },
      };
    }

    // setup message thread for a user
    if (user) {
      messageThread = {
        ...messageThread,
        ...{ recieve_user: user._id },
      };
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };

    //Send message to/from a Stall
    if (stall) {
      let stalls;

      // Get Message Threads for the Current User
      await axios
        .get(`/api/messagethreads/${currentUser}`, config)
        .then((result) => {
          const threads = result.data;
          stalls = threads.filter((thread) => {
            return thread.stall_name === stall.stallName;
          });
        })
        .catch((error) => {
          console.error(error.message);
          controller.abort();
          return new Error(error.message);
        });

      if (stalls.length === 0) {
        // No message thread between the user and stall exist
        // Create new message thread
        await axios
          .post("/api/messagethreads/", messageThread, config)
          .then((result) => {
            return navigate("/account/messages", { state: result.data });
          })
          .catch((error) => {
            console.error(error.message);
            controller.abort();
            return new Error(error.message);
          });
      } else {
        // User has messaged the stall previsouly
        // Get the previous thread
        const threads = stalls.filter((thread) => {
          return thread.message_members.includes(currentUser);
        });

        if (threads.length > 0) {
          return navigate("/account/messages", { state: threads[0] });
        } else {
          return navigate("/account/messages", { state: messageThread });
        }
      }
    }

    // Send message to a User
    else if (user) {
      return navigate("/account/messages", { state: messageThread });
    }

    return () => {
      controller.abort();
    };
  };

  return (
    <>
      <Button
        variant={variant || "contained"}
        onClick={(e) => handleOnClick(e)}
      >
        {children || "Message"}
      </Button>
    </>
  );
};

export default SendMessageButton;
