import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useContext } from "react";

import DataContext from "../../context/DataContext";

export default function MessageThread({ messageThread, currentUser }) {
  const [user, setUser] = useState(null);
  const [otherUserId] = useState(
    messageThread.message_members.find((m) => m !== currentUser)
  );
  const { setError, setLoading } = useContext(DataContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

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
        if (axios.isCancel(error)) return;
        setError([error]);
      }
    };
    getUser();

    setLoading(false);

    return () => {
      controller.abort();
    };
  }, [setError, otherUserId, setLoading]);

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
