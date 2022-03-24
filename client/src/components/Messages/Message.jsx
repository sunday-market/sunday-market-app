import { AlignVerticalCenter } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <>
      <Box
        sx={{
          ...(own === true && { alignItems: "flex-end" }),
          display: "flex",
          flexDirection: "column",
          ml: 4,
          mr: 4,
        }}
      >
        <Box sx={{ py: 2 }}>
          <Typography>{message.message}</Typography>
          <Typography>{format(message.createdAt)}</Typography>
        </Box>
      </Box>
    </>
  );
}
