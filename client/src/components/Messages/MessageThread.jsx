import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MessageThread({ messageThread, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const otherUserId = messageThread.message_members.find(
      (m) => m !== currentUser
    );
    const getUser = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal,
        };
        const res = await axios(`/api/user/${otherUserId}`, config);
        setUser(res.data.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          return "Successfully Aborted";
        }
      }
    };
    getUser();
    return () => {
      controller.abort();
    };
  }, [currentUser, messageThread]);
  return (
    <>
      <Box>
        {messageThread.stall_name ? (
          <Typography sx={{ fontWeight: "bold" }}>
            {messageThread.stall_name}
          </Typography>
        ) : (
          <></>
        )}
        <Typography>{user?.username}</Typography>
      </Box>
    </>
  );
}
