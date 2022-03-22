import { Box, Typography } from "@mui/material";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <>
      {own ? (
        <Box>
          <Typography>OWN..{message.message}</Typography>
          <Typography>{format(message.createdAt)}</Typography>
        </Box>
      ) : (
        <Box>
          <Typography>OTHER..{message.message}</Typography>
          <Typography>{format(message.createdAt)}</Typography>
        </Box>
      )}
    </>
  );
}
