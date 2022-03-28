import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Alert,
  Button,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function MyShoppingCartPage() {
  return (
    <>
      <Box p={2}>
        <Typography p={3} variant="h4">
          My Shopping Cart
        </Typography>
        {/* Grid item is shopping cart item */}
        <Grid container direction={"column"} spacing={0}>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            p={1.5}
            mr={2}
            mb={2}
            boxShadow={2}
            bgcolor="blueGrey.50"
          >
            <Box
              component="img"
              maxHeight={100}
              height="30px"
              width={30}
              bgcolor={"black"}
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            p={1.5}
            mr={2}
            boxShadow={2}
            bgcolor={"red"}
          >
            <Box
              component="img"
              maxHeight={100}
              height="30px"
              width={30}
              bgcolor={"black"}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
