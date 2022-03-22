import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MessageThread({ messageThread, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const otherUserId = messageThread.members.find(
      (m) => m !== currentUser._id
    );
    const getUser = async () => {
      try {
        const res = await axios(`/api/user/${otherUserId}`);
        setUser(res.data);
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
