import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Image as ImageIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function AddMyStallPage() {
  const [stallName, setStallName] = useState("");
  const [image, setImage] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [activateStall, setActivateStall] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [user, setCurrentUser] = useState(null);

  // navigation
  const navigate = useNavigate();
  const errorRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const getUser = async () => {
        try {
          setCurrentUser(await jwtDecode(localStorage.getItem("authToken")));
        } catch (error) {
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login");
          }
          setTimeout(() => {
            setError("");
          }, 5000);
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return setError(error);
        }
      };
      getUser();
    }
  }, [navigate]);

  useEffect(() => {
    const getCategorys = async () => {
      try {
        setCategoryList(await (await axios.get("/api/category/")).data);
      } catch (error) {
        setTimeout(() => {
          setError("");
        }, 5000);
        errorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return setError(error);
      }
    };
    getCategorys();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const saveStall = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const stallData = new FormData();
    let userData;

    // Check user
    if (user) {
      try {
        userData = await axios.get(`/api/user/${user.id}`, config);
        userData = userData.data.data;
        if (userData.length === 0) {
          // if length is 0 then user is not genuine and
          // must remove token and navigate to home
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          stallData.append("user", user.id);
        }
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
        setTimeout(() => {
          setError("");
        }, 5000);
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        return setError(error);
      }
    }

    // Check stall name for a value
    if (stallName === "" || stallName.trim() === "") {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You Need To Provide A Stall Name");
    } else {
      stallData.append("stallName", stallName);
    }
 
    // Check for Category selected
    if (!category) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You need to select a category to upload a store");
    } else {
      stallData.append("category", category);
    }
    // set current activated to currently selected radio button - false by default
    stallData.append("activated", activateStall);

    // check and set description
    if (description) {
      stallData.append("description", description);
    }

    // check if image set
    if (image) {
      stallData.append("image", image);
    }

    // check email
    if (!contactEmail) {
      stallData.append("email", userData.email);
    } else {
      stallData.append("email", contactEmail);
    }

    // check location
    if (!location) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You must provide a location for the stall");
    } else {
      stallData.append("city_location", location);
    }

    // try and post the data
    try {
      await axios.post("/api/stalls/", stallData, config);
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        return navigate("/login");
      }
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You need to select a category to upload a store");
    }
  };

  return (
    <>
      <Box p={2}>
        <Typography variant="h4">Create A Stall</Typography>
        <Grid container direction={"column"} spacing={1}>
          {/* Error Alert */}
          <Grid item ref={errorRef}>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>
          <Grid item>
            <InputLabel required>Stall Name</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={stallName}
              onChange={(e) => setStallName(e.target.value)}
              placeholder="Enter A Stall Name.."
              sx={{ background: "white" }}
            />
          </Grid>
          {/* Image Upload  */}
          <Grid item>
            <InputLabel>Upload an image</InputLabel>
            <Typography variant="body2" gutterBottom>
              Add An Image And Express Your {stallName ? stallName : "Stall"}
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<ImageIcon />}
              size="small"
              sx={{ margin: 1, marginLeft: 0 }}
            >
              <input
                accept="image/*"
                hidden
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
              Add Image
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setImage("")}
              size="small"
              sx={{ margin: 1 }}
            >
              Remove Image
            </Button>
            {image && (
              <Grid item mt={2}>
                <Typography variant="body2">Image: {image.name} </Typography>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <FormControl>
              <FormLabel id="activate-stall-button-group">
                Activate {stallName ? stallName : "Stall"}
              </FormLabel>
              <Typography variant="body2" gutterBottom>
                Ready For {stallName ? stallName : "Your Stall"} To Go Live?
              </Typography>
              <RadioGroup
                row
                aria-labelledby="activate-stall-button-group"
                name="controll-radio-button-group"
                value={activateStall}
                onChange={(e) => setActivateStall(e.target.value)}
              >
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No Keep Deactivated For Now"
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Yes Lets Activate It Now"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* The category value needs to be stored as an id of category as the model only accepts object IDS */}
          <Grid item>
            <InputLabel required>Category</InputLabel>
            <Select
              disabled={categoryList.length === 0}
              variant="outlined"
              size="small"
              fullWidth
              value={category}
              placeholder="Choose A Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ background: "white" }}
            >
              {categoryList.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.category_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <InputLabel>Stall Description</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter A Description About ${
                stallName ? stallName : "Your Stall"
              }`}
              sx={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            <InputLabel>Stall Contact Details</InputLabel>
            <Typography variant="body2" gutterBottom>
              If the Stall uses a different email from your account enter it
              below
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={`Enter ${
                stallName ? stallName : "A Stall"
              } Contact Email..`}
              sx={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            <InputLabel required>Stall Location</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={`Enter where the ${
                stallName ? stallName : "Stall"
              } is based..`}
              sx={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            <Grid container justifyContent="center">
              <Button
                sx={{ margin: 1 }}
                variant="contained"
                onClick={saveStall}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                sx={{ margin: 1 }}
                variant="outlined"
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
