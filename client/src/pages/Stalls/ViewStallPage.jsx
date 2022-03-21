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
  const stallid = params.stallID;

  // error ref for scrolling
  const errorRef = useRef(null);

  // Get stall info
  useEffect(() => {
    if (stallid) {
      const getStall = async () => {
        try {
          const stallData = await axios.get(`/api/stalls/${stallid}`);
          console.log(stallData.data);
          setStall(stallData.data);
        } catch (err) {
          setError("No Stall Exists with that ID");
        }
      };
      getStall();
    }
  }, [stallid]);

  // Get stall user from stall info
  useEffect(() => {
    if (stall.length !== 0) {
      const getUser = async (e) => {
        // Set header for Axios requests
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        try {
          const userID = stall[0].user;
          setUser(await axios.get(`api/user/${userID.id}`, config));
        } catch (err) {
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setError("User of this Stall can't be found can be found");
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      };
      getUser();
    }
  }, [stall, user]);

  return (
    <>
      <div>ViewStallPage</div>
      <div></div>
      <Grid container direction={"row"} spacing={2}>
        <Grid item ref={errorRef}>
          {error && <Alert severity="error">{error}</Alert>}
        </Grid>
      </Grid>
    </>
  );
}
