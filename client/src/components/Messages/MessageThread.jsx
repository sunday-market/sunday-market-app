import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MessageThread({ messageThread, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
        };
        const res = await axios(`/api/user/${otherUserId}`, config);
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, messageThread]);
  return (
    <>
      <Box>
        <Typography>{user?.username}</Typography>
      </Box>
    </>
  );
}
