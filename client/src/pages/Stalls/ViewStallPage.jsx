import { useRef, useEffect, useState } from "react";
import {
  Grid,
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
import axios from "axios";
import jwt from "jwt-decode";
import { useParams } from "react-router-dom";

export default function ViewStallPage() {
  const [stall, setStall] = useState([]);
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");

  // need for getting params
  const params = useParams();
  // error ref for scrolling
  const errorRef = useRef(null);
  // Set header for Axios requests
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Get stall info
  useEffect(() => {
    if (params.stallID) {
      const getStall = async (e) => {
        try {
          setStall(await axios.get(`/api/stalls/${params.stallID}`, config));
        } catch (error) {
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setError(error.response.data.error);
        }
      };
      getStall();
    }
  });
  // Get stall user from stall info
  useEffect(() => {
    if (params.stallID) {
      const getUser = async (e) => {
        try {
          const userID = await jwt(localStorage.getItem("authToken"));
          setUser(await axios.get(`api/user/${userID.id}`, config));
        } catch (error) {
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setError(error.response.data.error);
        }
      };
      getUser();
    }
  });
  return (
    <>
      <div>ViewStallPage</div>
      <Grid container direction={"row"} spacing={2}>
        <Grid item ref={errorRef}>
          {error && <Alert severity="error">{error}</Alert>}
        </Grid>
      </Grid>
    </>
  );
}
