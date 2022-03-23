import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Message from "../../components/Messages/Message";
import MessageThread from "../../components/Messages/MessageThread";

import {
  Grid,
  Box,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Alert,
  Button,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

export default function MessagePage() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Grid
        container
        display={"flex"}
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item lg={5} md={4} sm={3} xs={2}>
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
            MESSAGE THREADS
          </Typography>
        </Grid>
        <Grid item lg={7} md={8} sm={9} xs={10}>
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
        </Grid>
      </Grid>
    </Box>
  );
}
