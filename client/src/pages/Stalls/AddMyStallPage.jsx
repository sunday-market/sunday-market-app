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
  Divider,
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

export default function AddMyStallPage() {
  const [stallName, setStallName] = useState("");
  const [image, setImage] = useState("");
  const [activateStall, setActivateStall] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  // navigation
  const navigate = useNavigate();
  const errorRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  const saveStall = async (e) => {
    e.preventDefault();

    // Set header for Axios requests
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // check form details
    // Check stall name for a value
    if (stallName === "" || stallName.trim() === "") {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You Need To Provide A Stall Name");
    }
    // Check for stalls named the same
    // TODO
    //------

    // Check for Category selected
  };

  return (
    <>
      <Typography variant="h4">Create A Stall</Typography>
      <Grid container direction={"column"} spacing={2}>
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
            endIcon={<ImageIcon />}
            size="small"
            sx={{ margin: 1, marginLeft: 0 }}
          >
            <input
              accept="image/*"
              hidden
              type="file"
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
              <Typography variant="body2">Image: {image} </Typography>
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
            // disabled={category.length === 0}
            variant="outlined"
            size="small"
            fullWidth
            value={category}
            placeholder="Choose A Category"
            onChange={(e) => setCategory(e.target.value)}
            sx={{ background: "white" }}
          >
            {Array.from(Array(6)).map((_, index) => (
              <MenuItem key={index} value={`Category ${index}`}>
                {`Category ${index}`}
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
            If the Stall uses a different email from your account enter it below
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
    </>
  );
}