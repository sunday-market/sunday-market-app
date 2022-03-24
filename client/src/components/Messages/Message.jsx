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
          my: 2,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            width: "80%",
            ...(own === true && { bgcolor: "#80d8ff" }),
            ...(own === false && { bgcolor: "#cfd8dc" }),
          }}
        >
          <Typography sx={{ ...(own === true && { textAlign: "end" }) }}>
            {message.message}
          </Typography>
          <Typography
            sx={{
              ...(own === true && { textAlign: "end" }),
              fontSize: "10px",
              marginTop: 2,
            }}
          >
            {format(message.createdAt)}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
